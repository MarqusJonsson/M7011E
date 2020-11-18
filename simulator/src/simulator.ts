import { BaseBuilding } from './buildings/baseBuilding';
import { Prosumer } from './users/prosumer';
import { Manager } from './users/manager';
import { Environment } from './environment';
import { ELECTRICITY_SELL_RATIO } from './utils/realLifeData';
import { msToYMDHMSM } from './math/time';

export class Simulator {
	// Time variables
	private _updateIntervalMiliSeconds: number = 0;
	private _interval: number = 0;
	private _startTime = Date.now();
	private _previousTime: number = this._startTime;
	private _simulationTime: number = 0;
	private _deltaTime: number = 0;
	private _deltaTimeS: number = 0;
	private _fixedDeltaTime: number = 0;
	private _fixedTimeStep: boolean = false;
	private _updateDeltaTime: Function = this.updateDeltaTimeUsingRealTime;
	// Environment variables
	private _buildings: BaseBuilding[];
	private _environment: Environment;
	private _managers: Manager[] = [];
	private _prosumers: Prosumer[] = [];

	constructor(environment: Environment, managers: Manager[], prosumers: Prosumer[], buildings: BaseBuilding[], samplingIntervalMiliSeconds: number, fixedTimeStep: boolean = false, fixedDeltaTime: number = 1000) {
		this._environment = environment;
		this._managers = managers;
		this._prosumers = prosumers;
		this._buildings = buildings;
		this._fixedDeltaTime = fixedDeltaTime;
		this.setTimeStepFunction(samplingIntervalMiliSeconds, fixedTimeStep);
	}

	private tempLog(): string {
		const ymdhmsm = msToYMDHMSM(this.simulationTime);
		let logStr = `\t\t\t\t  Y: M: D: H: M: S: mS\n`
			+ `New time step, simulation time = `
			+ ymdhmsm.years.toString().padStart(2, " ") + ':'
			+ ymdhmsm.months.toString().padStart(2, " ") + ':'
			+ ymdhmsm.days.toString().padStart(2, " ") + ':'
			+ ymdhmsm.hours.toString().padStart(2, " ") + ':'
			+ ymdhmsm.minutes.toString().padStart(2, " ") + ':'
			+ ymdhmsm.seconds.toString().padStart(2, " ") + ':'
			+ ymdhmsm.miliseconds.toString().padStart(2, " ") + ', '
			+ `deltaTimeS = ${this.deltaTimeS}\n`;
		logStr += 'User\t\tCurrency\tPlantID\tBuffer%\tConsumption\tProduction\tDemand\t\tBlackout\n';
		this._managers.forEach((manager) => {
			const powerPlant = manager.powerPlant;
			logStr += `${manager.type}_${manager.id}`
				+ `\t${manager.currency.toExponential(3)}`
				+ `\t${powerPlant.id}`
				+ `\t${(powerPlant.battery.buffer / powerPlant.battery.capacity).toFixed(3)}`
				+ `\t${(powerPlant.consumption).toExponential(3)}`
				+ `\t${(powerPlant.production).toExponential(3)}`
				+ `\t${powerPlant.getDemand().toExponential(3)}`
				+ `\t${powerPlant.hasBlackout}\n`;
		});
		logStr += 'User\t\tCurrency\tHouseID\tBuffer%\tConsumption\tProduction\tDemand\t\tBlackout\n';
		this._prosumers.forEach((prosumer) => {
			const house = prosumer.house
			logStr += `${prosumer.type}_${prosumer.id}`
				+ `\t${prosumer.currency.toExponential(3)}`
				+ `\t${house.id}`
				+ `\t${(house.battery.buffer / house.battery.capacity).toFixed(3)}`
				+ `\t${(house.consumption).toExponential(3)}`
				+ `\t${(house.production).toExponential(3)}`
				+ `\t${house.getDemand().toExponential(3)}`
				+ `\t${house.hasBlackout}\n`;
		});
		return logStr;
	}
	
	public run() {
		this.interval = <any> setInterval(() => {
			this.update()
		}, this.updateIntervalMiliSeconds);
	}

	public update() {
		this.updateElectricityConsumptionValues();
		this.updateElectricityProductionValues();
		this.updatePrices();
		this.generateElectricity();
		this.prosumersSellElectricity();
		this.prosumersBuyElectricity();
		this.consumeElectricity();
		this._updateDeltaTime();
		console.log(this.tempLog());
	}
	
	private updatePrices() {
		this._managers.forEach((manager) => {
			let demand: number = 0;
			const prosumers = manager.prosumers;
			prosumers.forEach((prosumer) => {
				demand += prosumer.house.getDemand();
			});
			const buyPrice: number = manager.calcBuyPrice(1, demand / prosumers.length, this.deltaTimeS);
			manager.setBuyPrice(buyPrice);
			manager.setSellPrice(buyPrice * ELECTRICITY_SELL_RATIO);
		});
	}

	private updateElectricityConsumptionValues() {
		this._buildings.forEach((building) => {
			building.calculateConsumption(this.deltaTimeS, this._environment, this._simulationTime);
		});
	}
	private updateElectricityProductionValues() {
		this._buildings.forEach((building) => {
			building.calculateProduction(this.deltaTimeS, this._environment);
		});
	}

	private generateElectricity() {
		this._managers.forEach((manager) => {
			const powerPlant = manager.powerPlant;
			powerPlant.generateElectricity();
			manager.prosumers.forEach((prosumer) => {
				prosumer.house.generateElectricity(powerPlant.battery)
			});
		});
	}

	private prosumersSellElectricity() {
		this._managers.forEach((manager) => {
			manager.prosumers.forEach((prosumer) => {
				prosumer.sellElectricity(manager);
			});
		});
	}

	private prosumersBuyElectricity() {
		this._managers.forEach((manager) => {
			manager.prosumers.forEach((prosumer) => {
				prosumer.buyElectricity(manager);
			});
		});
	}

	private consumeElectricity() {
		this._buildings.forEach((building) => {
			building.consumeElectricity();
		});
	}

	private updateDeltaTimeUsingRealTime() {
		const currentTime = Date.now();
		this.simulationTime = currentTime - this._startTime;
		this.deltaTime = currentTime - this.previousTime;
		this.deltaTimeS = this.deltaTime / 1000;
		this.previousTime = currentTime;
	}

	private updateDeltaTimeUsingFixedTime() {
		this.simulationTime += this.fixedDeltaTime;
		this.deltaTime = this.fixedDeltaTime;
		this.deltaTimeS = this.deltaTime / 1000;
	}

	private setTimeStepFunction(updateIntervalMiliSeconds: number, fixedTimeSteps: boolean = false) {
		this.fixedTimeStep = fixedTimeSteps;
		this.updateIntervalMiliSeconds = updateIntervalMiliSeconds;
		this._updateDeltaTime = fixedTimeSteps ? this.updateDeltaTimeUsingFixedTime : this.updateDeltaTimeUsingRealTime;
	}

	private get updateIntervalMiliSeconds(): number {
		return this._updateIntervalMiliSeconds;
	}
	
	private set updateIntervalMiliSeconds(ms: number) {
		this._updateIntervalMiliSeconds = ms;
	}

	private get interval(): number {
		return this._interval;
	}
	
	private set interval(handle: number) {
		clearInterval(this._interval);
		this._interval = handle;
	}
	
	private get simulationTime(): number {
		return this._simulationTime;
	}

	private set simulationTime(value: number) {
		this._simulationTime = value;
	}


	private get deltaTime(): number {
		return this._deltaTime;
	}

	private set deltaTime(value: number) {
		this._deltaTime = value;
	}

	private get deltaTimeS(): number {
		return this._deltaTimeS;
	}

	private set deltaTimeS(value: number) {
		this._deltaTimeS = value;
	}

	private get previousTime(): number {
		return this._previousTime;
	}
	
	private set previousTime(value: number) {
		this._previousTime = value;
	}

	private get fixedDeltaTime(): number {
		return this._fixedDeltaTime;
	}
	
	private set fixedDeltaTime(value: number) {
		this._fixedDeltaTime = value;
	}

	private get fixedTimeStep(): boolean {
		return this._fixedTimeStep;
	}
	
	private set fixedTimeStep(value: boolean) {
		this._fixedTimeStep = value;
	}

	public get environment(): Environment {
		return this._environment;
	}

	public get buildings(): BaseBuilding[] {
		return this._buildings;
	}
}

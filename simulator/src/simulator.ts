import { BaseBuilding } from './buildings/baseBuilding';
import { Prosumer } from './users/prosumer';
import { Manager } from './users/manager';
import { Environment } from './environment';
import { House } from './buildings/house';
import { BasePowerPlant } from './buildings/basePowerPlant';

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
		let logStr = '';
		this._managers.forEach((manager) => {
			logStr += 'User\t\tCurrency\n';
			logStr += `${manager.type}_${manager.id}\t${manager.currency.toFixed(2)}\n`;
			logStr += 'Owned buildings:\n';
			logStr += '\tPlantID\tBuffer%\tConsumption\tProduction\tDemand\t\tBlackout\n';
			manager.powerPlants.forEach((powerPlant) => {
				logStr += `\t${powerPlant.id}`
					+ `\t${(powerPlant.battery.buffer / powerPlant.battery.capacity).toFixed(3)}`
					+ `\t${(powerPlant.consumption).toExponential(3)}`
					+ `\t${(powerPlant.production).toExponential(3)}`
					+ `\t${powerPlant.getDemand(this.deltaTimeS).toExponential(3)}`
					+ `\t${powerPlant.hasBlackout}\n`;
			});
			logStr += '\n';
		});
		this._prosumers.forEach((prosumer) => {
			logStr += 'User\t\tCurrency\n';
			logStr += `${prosumer.type}_${prosumer.id}\t${prosumer.currency.toFixed(2)}\n`;
			logStr += 'Owned buildings:\n';
			logStr += '\tHouseID\tBuffer%\tConsumption\tProduction\tDemand\t\tBlackout\n';
			prosumer.houses.forEach((house) => {
				logStr += `\t${house.id}`
					+ `\t${(house.battery.buffer / house.battery.capacity).toFixed(3)}`
					+ `\t${(house.consumption).toExponential(3)}`
					+ `\t${(house.production).toExponential(3)}`
					+ `\t${house.getDemand(this.deltaTimeS).toExponential(3)}`
					+ `\t${house.hasBlackout}\n`;
			});
			logStr += '\n';
		});
		return logStr;
	}
	
	public run() {
		this.interval = <any> setInterval(() => {
			this.update()
		}, this.updateIntervalMiliSeconds);
	}

	public update() {
		this.updateProductionCalculations();
		this.updatePrices();
		this.updateElectricityGeneration();
		this.sellProsumersElectricity();
		this.purchaseProsumersElectricity();
		this.updateElectricityConsumption();
		this._updateDeltaTime();
		let logStr = `New time step, time elapsed = ${this.simulationTime} (ms), deltaTimeS = ${this.deltaTimeS}\n`;
		console.log(logStr + this.tempLog());
	}
	
	private updatePrices() {
		const demands = new Map<[Manager, BasePowerPlant], number>();
		this._prosumers.forEach((prosumer) => {
			prosumer.houses.forEach((house) => {
				const managerPowerPlantTuple: [Manager, BasePowerPlant] = [house.powerPlantManager, house.powerPlant];
				let previousDemand = demands.get(managerPowerPlantTuple);
				if (previousDemand === undefined) previousDemand = 0;
				demands.set(
					managerPowerPlantTuple,
					previousDemand + house.getDemand(this.deltaTimeS)
				);
			});
		});
		demands.forEach((demand, managerPowerPlantTuple) => {
			const manager: Manager = managerPowerPlantTuple[0];
			const powerPlant: BasePowerPlant = managerPowerPlantTuple[1];
			const sellPrice: number = manager.calcSellPrice(demand, 1);
			manager.setSellPrice(powerPlant, sellPrice);
			manager.setBuyPrice(powerPlant, sellPrice * 2.5); // Hardcoded, buy price is 2.5 times higher than sell price
		});
	}

	private updateProductionCalculations() {
		this._buildings.forEach((building) => {
			building.calculateProduction(this.deltaTimeS, this._environment);
		});
	}

	private updateElectricityGeneration() {
		this._buildings.forEach((building) => {
			building.generateElectricity(this.deltaTimeS);
		});
	}

	private sellProsumersElectricity() {
		this._prosumers.forEach((prosumer) => {
			prosumer.sellElectricity();
		});
	}

	private purchaseProsumersElectricity() {
		this._prosumers.forEach((prosumer) => {
			prosumer.buyElectricity(this.deltaTimeS);
		});
	}

	private updateElectricityConsumption() {
		this._buildings.forEach((building) => {
			building.consumeElectricity(this.deltaTimeS, this._environment);
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
}
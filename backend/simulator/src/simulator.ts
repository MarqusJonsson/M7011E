import { Prosumer } from './users/prosumer';
import { Manager } from './users/manager';
import { Environment } from './environment';
import { ELECTRICITY_SELL_RATIO } from './utils/realLifeData';
import { ms_to_YMDHMSM } from './math/time';
import { Identifier, IMap } from './identifiable';

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
	private _environment: Environment;
	private _users: IMap<Manager | Prosumer>;
	private _managers: IMap<Manager> = new IMap<Manager>();
	private _prosumers: IMap<Prosumer> = new IMap<Prosumer>();
	private _addedProsumers: Prosumer[] = [];
	private _addedManagers: Manager[] = [];
	private _removedProsumers: Identifier[] = [];
	private _removedManagers: Identifier[] = [];

	constructor(environment: Environment, users: IMap<Manager | Prosumer>, samplingIntervalMiliSeconds: number, fixedTimeStep: boolean = false, fixedDeltaTime: number = 1000) {
		this._environment = environment;
		this._users = users;
		users.forEach((user) => {
			switch (user.type) {
				case Prosumer.name:
					const prosumer = <Prosumer> user;
					this._prosumers.iSet(prosumer);
					break;
				case Manager.name:
					const manager = <Manager> user;
					this._managers.iSet(manager);
					break;
			}
		});
		this._fixedDeltaTime = fixedDeltaTime;
		this.setTimeStepFunction(samplingIntervalMiliSeconds, fixedTimeStep);
	}

	private tempLog(): string {
		const ymdhmsm = ms_to_YMDHMSM(this.simulationTime);
		let logStr = `\t\t\t\t  Y: M: D: H: M: S: mS\n`
			+ `New time step, simulation time = `
			+ ymdhmsm.years.toString().padStart(2, ' ') + ':'
			+ ymdhmsm.months.toString().padStart(2, ' ') + ':'
			+ ymdhmsm.days.toString().padStart(2, ' ') + ':'
			+ ymdhmsm.hours.toString().padStart(2, ' ') + ':'
			+ ymdhmsm.minutes.toString().padStart(2, ' ') + ':'
			+ ymdhmsm.seconds.toString().padStart(2, ' ') + ':'
			+ ymdhmsm.miliseconds.toString().padStart(2, ' ') + ', '
			+ `deltaTimeS = ${this.deltaTimeS}\n`;
		logStr += 'User\t\tCurrency\tPlantID\tBuffer%\tConsumption\tProduction\tDemand\t\tBlackout\n';
		this._managers.forEach((manager) => {
			const powerPlant = manager.building;
			logStr += `${manager.type}_${manager.id}`
				+ `\t${manager.currency.toExponential(3)}`
				+ `\t${powerPlant.id}`
				+ `\t${(powerPlant.battery.buffer / powerPlant.battery.capacity).toFixed(3)}`
				+ `\t${(powerPlant.electricityConsumption).toExponential(3)}`
				+ `\t${(powerPlant.electricityProduction).toExponential(3)}`
				+ `\t${powerPlant.getDemand().toExponential(3)}`
				+ `\t${powerPlant.hasBlackout}\n`;
		});
		logStr += 'User\t\tCurrency\tHouseID\tBuffer%\tConsumption\tProduction\tDemand\t\tBlackout\n';
		this._prosumers.forEach((prosumer) => {
			const house = prosumer.building
			logStr += `${prosumer.type}_${prosumer.id}`
				+ `\t${prosumer.currency.toExponential(3)}`
				+ `\t${house.id}`
				+ `\t${(house.battery.buffer / house.battery.capacity).toFixed(3)}`
				+ `\t${(house.electricityConsumption).toExponential(3)}`
				+ `\t${(house.electricityProduction).toExponential(3)}`
				+ `\t${house.getDemand().toExponential(3)}`
				+ `\t${house.hasBlackout}\n`;
		});
		return logStr;
	}

	public run(steps: number = -1) {
		if (steps < 0) {
			this.interval = <any> setInterval(() => {
				this.update()
			}, this.updateIntervalMiliSeconds);
		} else if (steps > 0) {
			for (let i = 0; i < steps; i++) {
				this.update();
			}
		}
	}

	public update() {
		this.removeUsers();
		this.addUsers();
		this.updateEnvironmentVariables();
		this.updateElectricityConsumptionValues();
		this.updateElectricityProductionValues();
		this.updateModelledElectricityPrices();
		this.generateElectricity();
		this.prosumersSellElectricity();
		this.prosumersBuyElectricity();
		this.consumeElectricity();
		this.updateUsersValues();
		this._updateDeltaTime();
		//console.log(this.tempLog());
	}

	private updateEnvironmentVariables() {
		this._users.forEach((user) => {
			user.building.geoData.sampleEnvironmentVariables(this.environment, this.simulationTime);
		});
	}

	private updateElectricityConsumptionValues() {
		this._users.forEach((user) => {
			user.building.calculateConsumption(this.deltaTimeS);
		});
	}

	private updateElectricityProductionValues() {
		this._users.forEach((user) => {
			user.building.calculateProduction(this.deltaTimeS);
		});
	}

	private updateModelledElectricityPrices() {
		this.managers.forEach((manager) => {
			manager.building.totalDemand = 0;
			const prosumers = manager.prosumers;
			prosumers.forEach((prosumer) => {
				manager.building.totalDemand += prosumer.building.getDemand();
			});
			const modelledBuyPrice: number = manager.calcBuyPrice(1, manager.building.totalDemand / Math.max(prosumers.size, 1), this.deltaTimeS);
			const powerPlant = manager.building;
			powerPlant.modelledElectricityBuyPrice = modelledBuyPrice;
			powerPlant.modelledElectricitySellPrice = modelledBuyPrice * ELECTRICITY_SELL_RATIO;
		});
	}

	private generateElectricity() {
		this.managers.forEach((manager) => {
			const powerPlant = manager.building;
			powerPlant.generateElectricity();
			manager.prosumers.forEach((prosumer) => {
				prosumer.building.generateElectricity(powerPlant.battery)
			});
		});
	}

	private prosumersSellElectricity() {
		this.managers.forEach((manager) => {
			manager.prosumers.forEach((prosumer) => {
				prosumer.sellElectricity(manager);
			});
		});
	}

	private prosumersBuyElectricity() {
		this.managers.forEach((manager) => {
			manager.prosumers.forEach((prosumer) => {
				prosumer.buyElectricity(manager);
			});
		});
	}

	private consumeElectricity() {
		this.users.forEach((user) => {
			user.building.consumeElectricity();
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

	private addUsers() {
		this._addedProsumers.forEach((prosumer) => {
			this.prosumers.iSet(prosumer);
			this.users.iSet(prosumer);
		});
		this._addedManagers.forEach((manager) => {
			this.managers.iSet(manager);
			this.users.iSet(manager);
		});
		if (this._addedManagers.length > 0) {
			// If at least one new manager was added, all connections needs to be recalculated
			this.connectProsumersToManager(this.prosumers);
		} else if (this._addedProsumers.length > 0) {
			// If no new managers were added, the new prosumers must be connected to a manager
			this.connectProsumersToManager(this._addedProsumers);
		}
		// Empty the arrays
		this._addedProsumers.length = 0;
		this._addedManagers.length = 0;
	}

	// Adds a prosumer to the simulator
	public addProsumer(prosumer: Prosumer) {
		this._addedProsumers.push(prosumer);
	}

	// Adds a manager to the simulator
	public addManager(manager: Manager) {
		this._addedManagers.push(manager);
	}

	private removeUsers() {
		this._removedProsumers.forEach((prosumer) => {
			this.disconnectProsumerFromManager(prosumer);
			this.prosumers.iDelete(prosumer);
			this.users.iDelete(prosumer);
		});
		let managerlessProsumers: Prosumer[] = [];
		this._removedManagers.forEach((manager) => {
			const _manager = this.managers.uGet(manager);
			if (_manager !== undefined) {
				managerlessProsumers.push(..._manager.prosumers.values());
				this.managers.iDelete(manager);
				this.users.iDelete(manager);
			}
		});
		// Connect all prosumers who lost their manager to a new manager
		this.connectProsumersToManager(managerlessProsumers);
		// Empty the arrays
		this._removedProsumers.length = 0;
		this._removedManagers.length = 0;
	}

	public removeProsumer(identifier: Identifier) {
		if (identifier.type !== Prosumer.name) throw new Error('Tried to remove non prosumer when calling removeProsumer');
		this._removedProsumers.push(identifier);
	}

	public removeManager(identifier: Identifier) {
		if (identifier.type !== Manager.name) throw new Error('Tried to remove non prosumer when calling removeManager');
		this._removedManagers.push(identifier);
	}

	// Connects given prosumer to the geographically closest manager
	private connectProsumerToManager(prosumer: Prosumer) {
		const houseGeoData = prosumer.building.geoData;
		const managersIterable: IterableIterator<Manager> = this.managers.values();
		let closestManager: Manager = managersIterable.next().value;
		if (closestManager === undefined) return;
		let closestPowerPlantDistance: number = houseGeoData.distance(closestManager.building.geoData);
		for (const manager of managersIterable) {
			const distance = houseGeoData.distance(manager.building.geoData);
			if (distance < closestPowerPlantDistance) {
				closestManager = manager;
				closestPowerPlantDistance = distance;
			}
		};
		closestManager.prosumers.iSet(prosumer);
	}

	// Disconnects given prosumer from its given manager
	private disconnectProsumerFromManager(prosumer: Identifier) {
		this._managers.forEach((manager) => {
			if (manager.prosumers.iDelete(prosumer)) {
				return;
			}
		})
	}

	// Connects all provided prosumers to a manager
	public connectProsumersToManager(prosumers: IMap<Prosumer> | Prosumer[]) {
		prosumers.forEach((prosumer: Prosumer) => {
			this.connectProsumerToManager(prosumer);
		});
	}

	// Calls update function of all users
	public updateUsersValues() {
		this._users.forEach((user) => {
			user.update(this.deltaTimeS, this.simulationTime);
		});	
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

	public get deltaTimeS(): number {
		return this._deltaTimeS;
	}

	public set deltaTimeS(value: number) {
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

	public get users(): IMap<Manager | Prosumer> {
		return this._users;
	}

	public get managers(): IMap<Manager> {
		return this._managers;
	}
	
	public get prosumers(): IMap<Prosumer> {
		return this._prosumers;
	}
}

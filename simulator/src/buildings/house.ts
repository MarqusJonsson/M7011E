import { BaseBuilding } from './baseBuilding';
import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { BasePowerPlant } from "./basePowerPlant";
import { Manager } from '../users/manager';
import { Environment } from '../environment';


export class House extends BaseBuilding {
	public calculateConsumption(deltaTimeS: number, environment: Environment): void {
		throw new Error('Method not implemented.');
	}
	private _batteryToPowerPlantRatio: number;
	private _powerPlant: BasePowerPlant;
	private _powerPlantManager: Manager;
	constructor(battery: Battery, geoData: GeoData, generators: BaseGenerator[], consumption: number, powerPlant: BasePowerPlant, batteryToPowerPlantRatio: number, manager: Manager) {
		super(House.name, battery, geoData, generators, consumption);
		this._batteryToPowerPlantRatio = batteryToPowerPlantRatio;
		this._powerPlant = powerPlant;
		this._powerPlantManager = manager;
	}

	public generateElectricity(deltaTimeS: number) {
		const totalProduction = this.production * deltaTimeS;
		const productionToBattery: number = totalProduction * this.batteryToPowerPlantRatio;
		const productionToPowerPlant: number = totalProduction * (1 - this.batteryToPowerPlantRatio);
		const hBattery: Battery = this.battery;
		const pBattery: Battery = this.powerPlant.battery;
		if (hBattery.buffer + productionToBattery <= hBattery.capacity) {
			hBattery.buffer += productionToBattery;
			// Send power to power plant
			if (pBattery.buffer + productionToPowerPlant >= pBattery.capacity){
				this.electricityOutput = pBattery.capacity - pBattery.buffer;
				// Since power plant battery was filled, send rest to house battery
				hBattery.buffer = Math.min(hBattery.capacity, hBattery.buffer + productionToPowerPlant - this.electricityOutput);
			}
			else {
				this.electricityOutput = productionToPowerPlant;
			}
		}
		else {
			const excessElectricity: number = hBattery.buffer + productionToBattery - this.battery.capacity;
			hBattery.buffer = hBattery.capacity;
			// productionToPowerPlant + excessElectricity to power plant
			if (pBattery.buffer + excessElectricity + productionToPowerPlant >= pBattery.capacity){
				this.electricityOutput = pBattery.capacity - pBattery.buffer;
				// Since power plant battery was filled, send rest to house battery
				hBattery.buffer = Math.min(hBattery.capacity, hBattery.buffer + excessElectricity + productionToPowerPlant - this.electricityOutput);
			}
			else {
				this.electricityOutput = excessElectricity + productionToPowerPlant;
			}
		}
	}

	public get batteryToPowerPlantRatio(): number {
		return this._batteryToPowerPlantRatio;
	}
	
	public set batteryToPowerPlantRatio(value: number) {
		if(value > 1 || value < 0) {
			throw new Error(" value for batteryToPowerPlantRatio is not within range 0 to 1.")
		}
		this._batteryToPowerPlantRatio = value;
	}

	public get powerPlant(): BasePowerPlant {
		return this._powerPlant;
	}

	public set powerPlant(powerPlantParent: BasePowerPlant) {
		this._powerPlant = powerPlantParent;
	}

	public get powerPlantManager(): Manager {
		return this._powerPlantManager;
	}

	public set powerPlantManager(manager: Manager) {
		this._powerPlantManager = manager;
	}
}

import { BaseBuilding } from './baseBuilding';
import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { BasePowerPlant } from "./basePowerPlant";
import { Prosumer } from '../users/prosumer';
import { Environment } from '../environment';

export class House extends BaseBuilding {
	private _batteryToPowerPlantRatio: number;
	private _powerPlantParent: BasePowerPlant;
	private _prosumer: Prosumer;
	
	constructor(battery: Battery, geoData: GeoData, generators: BaseGenerator[], consumption: number, powerPlantParent: BasePowerPlant, prosumer: Prosumer, environment: Environment, batteryToPowerPlantRatio: number) {
		super(House.name, battery, geoData, generators, consumption, environment);
		this._batteryToPowerPlantRatio = batteryToPowerPlantRatio;
		this._powerPlantParent = powerPlantParent;
		this._prosumer = prosumer;
	}

	public generateElectricity(deltaTimeS: number) {
		const totalProduction = this.production * deltaTimeS;
		const productionToBattery: number = totalProduction * this.batteryToPowerPlantRatio;
		const productionToPowerPlant: number = totalProduction * (1 - this.batteryToPowerPlantRatio);
		let electricitySold = 0;
		const hBattery: Battery = this.battery;
		const pBattery: Battery = this.powerPlantParent.battery;
		if (hBattery.buffer + productionToBattery <= hBattery.capacity) {
			hBattery.buffer += productionToBattery;
			// Send power to power plant
			if (pBattery.buffer + productionToPowerPlant >= pBattery.capacity){
				electricitySold = pBattery.capacity - pBattery.buffer;
				pBattery.buffer = pBattery.capacity;
				// Since power plant battery was filled, send rest to house battery
				hBattery.buffer = Math.min(hBattery.capacity, hBattery.buffer + productionToPowerPlant - electricitySold);
			}
			else {
				electricitySold = productionToPowerPlant;
				pBattery.buffer += productionToPowerPlant;
			}
		}
		else {
			const excessElectricity: number = hBattery.buffer + productionToBattery - this.battery.capacity;
			hBattery.buffer = hBattery.capacity;
			// productionToPowerPlant + excessElectricity to power plant
			if (pBattery.buffer + excessElectricity >= pBattery.capacity){
				electricitySold = pBattery.buffer - pBattery.capacity;
				pBattery.buffer = pBattery.capacity;
				// Since power plant battery was filled, send rest to house battery
				hBattery.buffer = Math.min(hBattery.capacity, hBattery.buffer + excessElectricity - electricitySold);
			}
			else {
				electricitySold = excessElectricity;
				pBattery.buffer += excessElectricity;   
			}
		}
		const payment = this.powerPlantParent.calculateElectricityPrice(electricitySold);
		this.prosumer.currency += payment;
		this.powerPlantParent.manager.currency -= payment;
	}

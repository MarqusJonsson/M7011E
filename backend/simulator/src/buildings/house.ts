import { BaseBuilding } from './baseBuilding';
import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND } from '../utils/realLifeData';

export class House extends BaseBuilding {
	private _overproductionBatteryToPowerPlantRatio: number; // Ratio of how much goes to house battery when overproducing (eg. 1.0 = 100% to house battery)
	private _underproductionBatteryToPowerPlantRatio: number = 1; // Ratio of how much goes to house battery when underproducing (eg. 1.0 = 100% to house battery)

	constructor(battery: Battery, geoData: GeoData, generators: BaseGenerator[], overproductionBatteryToPowerPlantRatio: number) {
		super(House.name, battery, geoData, generators);
		this._overproductionBatteryToPowerPlantRatio = overproductionBatteryToPowerPlantRatio;
	}

	public calculateConsumption(deltaTimeS: number): void {
		const temperature = this.geoData.temperature;
		// TODO: replace 0.75 factor with something to compensate for the appending on average problem
		if (temperature < 0) {
			this.electricityConsumption = AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND * 0.75 * deltaTimeS * Math.pow(1.05, Math.abs(temperature));
		}
		else {
			this.electricityConsumption = AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND * 0.75 * deltaTimeS;
		}
	}

	public generateElectricity(pBattery: Battery) {
		const totalProduction = this.electricityProduction;
		let productionToBattery: number;
		let productionToPowerPlant: number;
		if (this.electricityConsumption - totalProduction < 0) {
			productionToBattery = totalProduction * this.overproductionBatteryToPowerPlantRatio;
			productionToPowerPlant = totalProduction - productionToBattery;
		}
		else {
			productionToBattery = totalProduction * this.underproductionBatteryToPowerPlantRatio;
			productionToPowerPlant = totalProduction * this.underproductionBatteryToPowerPlantRatio;
		}
		const hBattery: Battery = this.battery;
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

	public get overproductionBatteryToPowerPlantRatio(): number {
		return this._overproductionBatteryToPowerPlantRatio;
	}
	
	public set overproductionBatteryToPowerPlantRatio(value: number) {
		if(value > 1 || value < 0) {
			throw new Error('Value for OverproductionBatteryToPowerPlantRatio is not within range 0 to 1.')
		}
		this._overproductionBatteryToPowerPlantRatio = value;
	}

	public get underproductionBatteryToPowerPlantRatio(): number {
		return this._underproductionBatteryToPowerPlantRatio;
	}
	
	public set underproductionBatteryToPowerPlantRatio(value: number) {
		if(value > 1 || value < 0) {
			throw new Error('Value for underproductionBatteryToPowerPlantRatio is not within range 0 to 1.')
		}
		this._underproductionBatteryToPowerPlantRatio = value;
	}
}

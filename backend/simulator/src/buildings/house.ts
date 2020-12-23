import { BaseBuilding } from './baseBuilding';
import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND } from '../utils/realLifeData';

export class House extends BaseBuilding {
	private _overproductionRatio: number; // Ratio of how much goes to house battery and how much goes to the power plant when overproducing (eg. 1.0 = 100% to house battery)
	private _underproductionRatio: number = 1; // Ratio of how much electricity should be taken from battery and how much from the market when underproducing (eg 1.0 = take 100% from battery)

	constructor(battery: Battery, geoData: GeoData, generators: BaseGenerator[], overproductionRatio: number) {
		super(House.name, battery, geoData, generators);
		this._overproductionRatio = overproductionRatio;
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
		if (totalProduction - this.electricityConsumption > 0) {
			productionToBattery = totalProduction * this.overproductionRatio;
			productionToPowerPlant = totalProduction - productionToBattery;
		}
		else {
			productionToBattery = totalProduction;
			productionToPowerPlant = 0;
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

	public getDemand(): number {
		if (this.electricityProduction - this.electricityConsumption >= 0)
			return Math.max(this.electricityConsumption - this.battery.buffer, 0);
		else
			return Math.max(this.electricityConsumption - this.battery.buffer * this.underproductionRatio, 0);
	}

	public get overproductionRatio(): number {
		return this._overproductionRatio;
	}
	
	public set overproductionRatio(value: number) {
		if(value > 1 || value < 0) {
			throw new Error('Value for overproductionRatio is not within range 0 to 1.')
		}
		this._overproductionRatio = value;
	}

	public get underproductionRatio(): number {
		return this._underproductionRatio;
	}
	
	public set underproductionRatio(value: number) {
		if(value > 1 || value < 0) {
			throw new Error('Value for underproductionRatio is not within range 0 to 1.')
		}
		this._underproductionRatio = value;
	}
}

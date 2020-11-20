import { BaseBuilding } from './baseBuilding';
import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND } from "../utils/realLifeData";
import { IMap } from '../identifiable';

export class House extends BaseBuilding {
	private _batteryToPowerPlantRatio: number; // Ratio of how much goes to house battery (eg. 1.0 = 100% to house battery)
	constructor(battery: Battery, geoData: GeoData, generators: IMap<BaseGenerator>, batteryToPowerPlantRatio: number) {
		super(House.name, battery, geoData, generators);
		this._batteryToPowerPlantRatio = batteryToPowerPlantRatio;
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
		const productionToBattery: number = totalProduction * this.batteryToPowerPlantRatio;
		const productionToPowerPlant: number = totalProduction - productionToBattery;
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

	public get batteryToPowerPlantRatio(): number {
		return this._batteryToPowerPlantRatio;
	}
	
	public set batteryToPowerPlantRatio(value: number) {
		if(value > 1 || value < 0) {
			throw new Error('Value for batteryToPowerPlantRatio is not within range 0 to 1.')
		}
		this._batteryToPowerPlantRatio = value;
	}
}

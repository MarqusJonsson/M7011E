import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { BasePowerPlant } from './basePowerPlant';
import { COAL_POWER_PLANT_ELECTRICITY_CONSUMPTION_PER_SECOND } from '../utils/realLifeData'
import { IMap } from '../identifiable';
export class CoalPowerPlant extends BasePowerPlant{
	constructor(battery: Battery, geoData: GeoData, generators: IMap<BaseGenerator>){
		super(CoalPowerPlant.name, battery, geoData, generators);
	}

	public calculateConsumption(deltaTimeS: number): void {
		const temperature = this.geoData.temperature;
		if (temperature < 0) {
			this.electricityConsumption = COAL_POWER_PLANT_ELECTRICITY_CONSUMPTION_PER_SECOND * deltaTimeS * Math.pow(1.05, Math.abs(temperature));
		}
	}
}

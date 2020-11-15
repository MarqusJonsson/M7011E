import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { BasePowerPlant } from './basePowerPlant';
import { Environment } from '../environment';
import { COAL_POWER_PLANT_CONSUMPTION_PER_SECOND } from "../utils/realLifeData"
export class CoalPowerPlant extends BasePowerPlant{
	public calculateConsumption(deltaTimeS: number, environment: Environment, simulationTime: number): void {
		const date = new Date(simulationTime);
		const temperature = environment.sampleTemperature(this.geoData.longitude, this.geoData.latitude, date.getMonth());
		if ( temperature < 0){
			this.consumption =  COAL_POWER_PLANT_CONSUMPTION_PER_SECOND * deltaTimeS * 1.05^Math.abs(temperature);
		}
	}
	constructor(battery: Battery, geoData: GeoData, generators: BaseGenerator[], consumption: number){
		super(CoalPowerPlant.name, battery, geoData, generators, consumption);
	}
}

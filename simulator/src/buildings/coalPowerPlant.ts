import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { BasePowerPlant } from './basePowerPlant';
import { Environment } from '../environment';

export class CoalPowerPlant extends BasePowerPlant{
	public calculateConsumption(deltaTimeS: number, environment: Environment): void {
		throw new Error('Method not implemented.');
	}
	constructor(battery: Battery, geoData: GeoData, generators: BaseGenerator[], consumption: number){
		super(CoalPowerPlant.name, battery, geoData, generators, consumption);
	}
}

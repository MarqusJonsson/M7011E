import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { BasePowerPlant } from './basePowerPlant';

export class CoalPowerPlant extends BasePowerPlant{
	constructor(battery: Battery, geoData: GeoData, generators: BaseGenerator[], consumption: number){
		super(CoalPowerPlant.name, battery, geoData, generators, consumption);
	}
}

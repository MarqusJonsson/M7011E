import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { BasePowerPlant } from './basePowerPlant';
import { Manager } from '../users/manager';
import { Environment } from '../environment';

export class CoalPowerPlant extends BasePowerPlant{
	constructor(battery: Battery, geoData: GeoData, generators: BaseGenerator[], consumption: number, manager: Manager, environment: Environment){
		super(CoalPowerPlant.name, battery, geoData, generators, consumption, manager, environment);
	}
}

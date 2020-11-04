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

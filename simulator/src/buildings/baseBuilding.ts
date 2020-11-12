import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { Identifiable } from '../identifiable';
import { Environment } from '../environment';
export abstract class BaseBuilding extends Identifiable {
	private _battery: Battery;
	private _geoData: GeoData;
	private _generators: BaseGenerator[] = [];
	private _production: number = 0;
	private _hasBlackout: boolean = false;
	private _consumption: number;
	private _electricityOutput: number = 0;

	constructor(type: string, battery: Battery, geoData: GeoData, generators: BaseGenerator[], consumption: number) {
		super(type);
		this._battery = battery;
		this._geoData = geoData;
		this._generators = generators;
		this._consumption = consumption;
	}

	public calculateProduction(deltaTimeS: number, environment: Environment): number {
		if (this.hasBlackout) return 0;
		this.production = this.generators.reduce((totalProduction, generator) => {
			return totalProduction + generator.calculateOutput(environment, this.geoData);
		}, 0);
		return this.production * deltaTimeS;
	}

	public abstract calculateConsumption(deltaTimeS: number, environment: Environment): void;

	public abstract generateElectricity(deltaTimeS: number): void;

	public consumeElectricity(deltaTimeS: number, environment: Environment) {
		const remainingElectricity = this.battery.buffer - this.consumption * deltaTimeS;
		if (!this.hasBlackout) {
			if (remainingElectricity < 0) {
				this.hasBlackout = true;
				this.battery.buffer = 0;
			}
			else {
				this.battery.buffer = remainingElectricity;
			}
		}
		else if (remainingElectricity >= 0) {
			this.hasBlackout = false;
			this.battery.buffer = remainingElectricity;
		}
	}

	public getDemand(deltaTimeS: number): number {
		return Math.max((this.consumption - this.production) * deltaTimeS - this.battery.buffer, 0);
	}

	public get battery(): Battery {
		return this._battery;
	}

	public set battery(battery: Battery) {
		this._battery = battery;
	}

	public get geoData(): GeoData {
		return this._geoData;
	}

	public set geoData(geoData: GeoData) {
		this._geoData = geoData;
	}

	public get generators(): BaseGenerator[] {
		return this._generators;
	}

	public set generators(generators: BaseGenerator[]) {
		this._generators = generators;
	}

	public get production(): number {
		return this._production;
	}

	public set production(value: number) {
		this._production = value;
	}

	public get hasBlackout(): boolean {
		return this._hasBlackout;
	}

	public set hasBlackout(bool: boolean) {
		this._hasBlackout = bool;
	}

	public get consumption(): number{
		return this._consumption;
	}

	public set consumption(value: number){
		this._consumption = value;
	}

	public get electricityOutput(): number{
		return this._electricityOutput;
	}

	public set electricityOutput(value: number){
		this._electricityOutput = value;
	}
}

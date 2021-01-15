import { Battery } from './components/battery';
import { GeoData } from './components/geoData';
import { BaseGenerator } from '../generators/baseGenerator';
import { Identifiable } from '../identifiable';

export abstract class BaseBuilding extends Identifiable {
	private _battery: Battery;
	private _geoData: GeoData;
	private _generators: BaseGenerator[];
	private _hasBlackout: boolean = false;
	private _electricityProduction: number = 0;
	private _electricityConsumption: number = 0;
	private _electricityOutput: number = 0;

	constructor(type: string, battery: Battery, geoData: GeoData, generators: BaseGenerator[]) {
		super(type);
		this._battery = battery;
		this._geoData = geoData;
		this._generators = generators;
	}

	public update(deltaTimeS: number, simulationTime: number) {}

	public calculateProduction(deltaTimeS: number): number {
		if (this.hasBlackout) return 0;
		this._electricityProduction = 0;
		this.generators.forEach((generator) => {
			this._electricityProduction += generator.calculateOutput(this.geoData);
		});
		this._electricityProduction *= deltaTimeS;
		return this.electricityProduction;
	}

	public abstract calculateConsumption(deltaTimeS: number): void;

	public abstract generateElectricity(pBattery?: Battery): void;

	public consumeElectricity() {
		const remainingElectricity = this.battery.buffer - this.electricityConsumption;
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

	public getDemand(): number {
		return Math.max(this.electricityConsumption - this.battery.buffer, 0);
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

	public get electricityProduction(): number {
		return this._electricityProduction;
	}

	public set electricityProduction(value: number) {
		this._electricityProduction = value;
	}

	public get hasBlackout(): boolean {
		return this._hasBlackout;
	}

	public set hasBlackout(bool: boolean) {
		this._hasBlackout = bool;
	}

	public get electricityConsumption(): number{
		return this._electricityConsumption;
	}

	public set electricityConsumption(value: number){
		this._electricityConsumption = value;
	}

	public get electricityOutput(): number{
		return this._electricityOutput;
	}

	public set electricityOutput(value: number){
		this._electricityOutput = value;
	}
}

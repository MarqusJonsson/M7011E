import { BaseBuilding } from '../buildings/baseBuilding';
import { Identifiable } from '../identifiable';
import { Environment } from '../environment';
import { GeoData } from '../buildings/components/geoData';


export abstract class BaseGenerator extends Identifiable {
	private _baseOutput: number;
	private _output: number = 0;
	private _isBroken: boolean;
	private _pollution: number;

	constructor(baseOutput: number = 0, isBroken: boolean = false, pollution: number = 0) {
		super(BaseGenerator.name);
		this._baseOutput = baseOutput;
		this._isBroken = isBroken;
		this._pollution = pollution;
	}

	public break(downtime_ms: number) {
		this.isBroken = true;
		setTimeout(() => {
			this.isBroken = false;
		}, downtime_ms);
	}

	public abstract calculateOutput(geoData: GeoData): number;

	public get baseOutput(): number {
		return this._baseOutput;
	}
	
	public set baseOutput(value: number) {
		this._baseOutput = value;
	}

	public get output(): number {
		return this._output;
	}
	
	public set output(value: number) {
		this._output = value;
	}

	public get isBroken(): boolean {
		return this._isBroken;
	}
	
	public set isBroken(value: boolean) {
		this._isBroken = value;
	}

	public get pollution(): number {
		return this._pollution;
	}
	
	public set pollution(value: number) {
		this._pollution = value;
	}
}

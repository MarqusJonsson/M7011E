import { BaseBuilding } from '../buildings/baseBuilding';
import { Identifiable } from '../identifiable';

export abstract class BaseGenerator extends Identifiable {
	private _baseOutput: number;
	private _output: number = 0;
	private _isBroken: boolean;
	private _parentBuilding?: BaseBuilding;
	private _pollution: number;

	constructor(baseOutput: number = 0, isBroken: boolean = false, parentBuilding?: BaseBuilding, pollution: number = 0) {
		super(BaseGenerator.name);
		this._baseOutput = baseOutput;
		this._isBroken = isBroken;
		this._parentBuilding = parentBuilding;
		this._pollution = pollution;
	}

	public break(downtime_ms: number) {
		this.isBroken = true;
		setTimeout(() => {
			this.isBroken = false;
		}, downtime_ms);
	}

	public abstract calculateOutput(): number;

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

	public get parentBuilding(): BaseBuilding | undefined  {
		return this._parentBuilding;
	}
	
	public set parentBuilding(parentBuilding: BaseBuilding | undefined) {
		this._parentBuilding = parentBuilding;
	}

	public get pollution(): number  {
		return this._pollution;
	}
	
	public set pollution(value: number) {
		this._pollution = value;
	}
}

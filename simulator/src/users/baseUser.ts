import { Identifiable } from "../identifiable";

export abstract class BaseUser extends Identifiable {
	private _currency: number;
	
	constructor(type: string, currency: number = 0) {
		super(type);
		this._currency = currency; 
	}


import { Identifiable } from '../identifiable';

export abstract class BaseUser extends Identifiable {
	private _currency: number;
	
	constructor(type: string, currency: number = 0) {
		super(type);
		this._currency = currency; 
	}
	
	public get currency() : number {
		return this._currency;
	}
	
	public set currency(value: number) {
		if (value < 0) {
			throw new Error('Value can not be less than 0');
		}
		this._currency = value;
	}
}

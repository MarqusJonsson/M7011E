import { Identifiable } from '../identifiable';

export abstract class BaseUser extends Identifiable {
	private _currency: number;
	
	constructor(type: string, currency: number = 0) {
		super(type);
		this._currency = currency; 
	}

	protected canAfford(amount: number) {
		return this.currency >= amount ? true : false;
	}
	
	public get currency() : number {
		return this._currency;
	}
	
	public set currency(value: number) {
		this._currency = value;
	}
}

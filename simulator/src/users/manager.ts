import { BaseUser } from './baseUser';
import { BasePowerPlant } from '../buildings/basePowerPlant';

export class Manager extends BaseUser {
	private _powerPlants: BasePowerPlant[];

	constructor(currency: number = 0, powerPlants: BasePowerPlant[] = []) {
		super(Manager.name, currency);
		this._powerPlants = powerPlants;
	}

	public get powerPlants() : BasePowerPlant[] {
		return this._powerPlants;
	}
	
	public set powerPlants(value: BasePowerPlant[]) {
		this._powerPlants = value;
	}

	public setBuyPrice(powerPlant: BasePowerPlant, price: number) {
		powerPlant.electricityBuyPrice = price;
	}

	public setSellPrice(powerPlant: BasePowerPlant, price: number) {
		powerPlant.electricitySellPrice = price;
	}

	public calcSellPrice(demand: number, electricity: number): number {
		return demand * electricity * 0.000000000394993331282;
	}
}

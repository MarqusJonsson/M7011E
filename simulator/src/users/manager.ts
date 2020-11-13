import { BaseUser } from './baseUser';
import { BasePowerPlant } from '../buildings/basePowerPlant';
import { electricityPricePerWattSecond } from '../utils/realLifeData';

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

	// Buy price is the price to buy electricity from a manager's power plant
	public setBuyPrice(powerPlant: BasePowerPlant, price: number) {
		powerPlant.electricityBuyPrice = price;
	}

	// Sell price is the price to sell electricity to a manager's power plant
	public setSellPrice(powerPlant: BasePowerPlant, price: number) {
		powerPlant.electricitySellPrice = price;
	}

	public calcBuyPrice(averageDemand: number, electricity: number): number {
		return electricity * electricityPricePerWattSecond(averageDemand);
	}
}

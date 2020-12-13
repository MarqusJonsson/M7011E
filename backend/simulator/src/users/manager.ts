import { BaseUser } from './baseUser';
import { BasePowerPlant } from '../buildings/basePowerPlant';
import { electricityPricePerWattSecond } from '../utils/realLifeData';
import { Prosumer } from './prosumer';
import { IMap } from '../identifiable';

export class Manager extends BaseUser<BasePowerPlant> {
	private _prosumers: IMap<Prosumer>;

	constructor(currency: number = 0, powerPlant: BasePowerPlant, id?: number, prosumers: IMap<Prosumer> = new IMap<Prosumer>()) {
		super(Manager.name, currency, powerPlant, id);
		this._prosumers = prosumers;
	}
	
	// Buy price is the price to buy electricity from a manager's power plant
	public setBuyPrice(price: number) {
		this.building.electricityBuyPrice = price;
	}

	// Sell price is the price to sell electricity to a manager's power plant
	public setSellPrice(price: number) {
		this.building.electricitySellPrice = price;
	}

	public calcBuyPrice(electricity: number, averageDemand: number, deltaTimeS: number): number {
		return electricity * electricityPricePerWattSecond(averageDemand, deltaTimeS);
	}

	public get prosumers() : IMap<Prosumer> {
		return this._prosumers;
	}
	
	public set prosumers(value: IMap<Prosumer>) {
		this._prosumers = value;
	}
}

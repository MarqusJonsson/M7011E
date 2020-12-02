import { BaseUser } from './baseUser';
import { BasePowerPlant } from '../buildings/basePowerPlant';
import { electricityPricePerWattSecond } from '../utils/realLifeData';
import { Prosumer } from './prosumer';
import { IMap } from '../identifiable';

export class Manager extends BaseUser {
	private _powerPlant: BasePowerPlant;
	private _prosumers: IMap<Prosumer>;

	constructor(currency: number = 0, powerPlant: BasePowerPlant, prosumers: IMap<Prosumer> = new IMap<Prosumer>()) {
		super(Manager.name, currency);
		this._powerPlant = powerPlant;
		this._prosumers = prosumers;
	}
	
	// Buy price is the price to buy electricity from a manager's power plant
	public setBuyPrice(price: number) {
		this.powerPlant.electricityBuyPrice = price;
	}

	// Sell price is the price to sell electricity to a manager's power plant
	public setSellPrice(price: number) {
		this.powerPlant.electricitySellPrice = price;
	}

	public calcBuyPrice(electricity: number, averageDemand: number, deltaTimeS: number): number {
		return electricity * electricityPricePerWattSecond(averageDemand, deltaTimeS);
	}

	public get powerPlant() : BasePowerPlant {
		return this._powerPlant;
	}
	
	public set powerPlant(value: BasePowerPlant) {
		this._powerPlant = value;
	}

	public get prosumers() : IMap<Prosumer> {
		return this._prosumers;
	}
	
	public set prosumers(value: IMap<Prosumer>) {
		this._prosumers = value;
	}
}

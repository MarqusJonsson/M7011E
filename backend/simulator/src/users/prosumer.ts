import { BaseUser } from './baseUser';
import { House } from '../buildings/house';
import { Manager } from './manager';

export class Prosumer extends BaseUser {
	private _house: House;

	constructor(currency: number = 0, house: House, id?: number) {
		super(Prosumer.name, currency, id);
		this._house = house;
	}
	
	public setBatteryToPowerPlantRatio(ratio: number) {
		this.house.batteryToPowerPlantRatio = ratio;
	}
	
	public get house() : House{
		return this._house;
	}

	public set house(house: House) {
		this._house = house;
	}

	public buyElectricity(manager: Manager): void {
		let payment: number = 0;
		const houseDemand = this.house.getDemand();
		const electricityBuyPrice = manager.powerPlant.electricityBuyPrice;
		const currencyDifference = this.currency - houseDemand * electricityBuyPrice;
		const hBattery = this.house.battery;
		const pBattery = manager.powerPlant.battery;
		if (houseDemand > 0){
			if (currencyDifference >= 0){
				if (houseDemand <= pBattery.buffer){
					payment = houseDemand * electricityBuyPrice;
					pBattery.buffer -= houseDemand;
					hBattery.buffer += houseDemand;
				}
				else {
					payment = pBattery.buffer * electricityBuyPrice;
					hBattery.buffer += pBattery.buffer;
					pBattery.buffer = 0;
				}
			}
			else if (currencyDifference < 0){
				const maxAffordableElectricity: number = this.currency / electricityBuyPrice;
				if (maxAffordableElectricity <= pBattery.buffer){
					payment = this.currency;
					hBattery.buffer += maxAffordableElectricity;
					pBattery.buffer -= maxAffordableElectricity;
				}
				else {
					payment = pBattery.buffer * electricityBuyPrice;
					hBattery.buffer += pBattery.buffer;
					pBattery.buffer = 0;
				}
			}
			manager.currency += payment;
			this.currency -= payment;
		}
		//else {
		//	console.log('Demand already satisfied');
		//}
	}

	public sellElectricity(manager: Manager) {
		const powerPlant = manager.powerPlant;
		if (manager.currency > 0) {
			const payment = powerPlant.calculateElectricityPrice(this.house.electricityOutput);
			if (manager.currency >= payment) {
				powerPlant.battery.buffer += this.house.electricityOutput;
				this.currency += payment;
				manager.currency -= payment;
			} else {
				// The manager could not afford all of the electricity, buy as much is possible
				const maxAffordableElectricity = manager.currency / powerPlant.electricitySellPrice;
				const unsoldElectricity = this.house.electricityOutput - maxAffordableElectricity;
				powerPlant.battery.buffer += maxAffordableElectricity;
				this.currency += manager.currency;
				manager.currency = 0;
				// Put as much of the unsold the electricity as possible back in the house battery, the rest gets wasted
				this.house.battery.buffer = Math.min(this.house.battery.buffer + unsoldElectricity, this.house.battery.capacity);
			}
		} else {
			// Put as much of the unsold electricity as possible back in the house battery, the rest gets wasted
			this.house.battery.buffer = Math.min(this.house.battery.buffer + this.house.electricityOutput, this.house.battery.capacity);
		}
	}
}

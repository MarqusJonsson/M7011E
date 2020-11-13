import { BaseUser } from './baseUser';
import { House } from '../buildings/house';

export class Prosumer extends BaseUser {
	private _houses: House[];

	constructor(currency: number = 0, houses: House[] = []) {
		super(Prosumer.name, currency);
		this._houses = houses;
	}
	
	public setBatteryToPowerPlantRatio(houseId: number, ratio: number) {
		let house: House | undefined = this.houses.find(house => house.id === houseId);
		if (house === undefined) {
			throw new Error('house with given houseId is not owned by this prosumer');
		}
		house.batteryToPowerPlantRatio = ratio;
	}
	
	public get houses() : House[] {
		return this._houses;
	}

	public set houses(houses: House[]) {
		this._houses = houses;
	}

	public buyElectricity(deltaTimeS: number): void {
		for (const house of this.houses){
			let payment: number = 0;
			const houseDemand = house.getDemand(deltaTimeS);
			const electricityBuyPrice = house.powerPlant.electricityBuyPrice;
			const currencyDifference = this.currency - houseDemand * electricityBuyPrice;
			const hBattery = house.battery;
			const pBattery = house.powerPlant.battery;
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
				house.powerPlantManager.currency += payment;
				this.currency -= payment;
			}
			//else {
			//	console.log('Demand already satisfied');
			//}
		}
	}

	public sellElectricity() {
		for (const house of this.houses){
			const manager = house.powerPlantManager;
			const powerPlant = house.powerPlant;
			if (manager.currency > 0) {
				const payment = powerPlant.calculateElectricityPrice(house.electricityOutput);
				if (manager.currency >= payment) {
					powerPlant.battery.buffer += house.electricityOutput;
					this.currency += payment;
					manager.currency -= payment;
				} else {
					// The manager could not afford all of the electricity, buy as much is possible
					const maxAffordableElectricity = manager.currency / powerPlant.electricitySellPrice;
					const unsoldElectricity = house.electricityOutput - maxAffordableElectricity;
					powerPlant.battery.buffer += maxAffordableElectricity;
					this.currency += manager.currency;
					manager.currency = 0;
					// Put as much of the unsold the electricity as possible back in the house battery, the rest gets wasted
					house.battery.buffer = Math.min(house.battery.buffer + unsoldElectricity, house.battery.capacity);
				}
			} else {
				// Put as much of the unsold electricity as possible back in the house battery, the rest gets wasted
				house.battery.buffer = Math.min(house.battery.buffer + house.electricityOutput, house.battery.capacity);
			}
		}
	}
}

import { BaseUser } from './baseUser';
import { House } from '../buildings/house';
import { Manager } from './manager';

export class Prosumer extends BaseUser<House> {
	private isBlocked : boolean = false;
	constructor(currency: number = 0, house: House, id?: number) {
		super(Prosumer.name, currency, house, id);
	}
	
	public setBatteryToPowerPlantRatio(ratio: number) {
		this.building.batteryToPowerPlantRatio = ratio;
	}

	public buyElectricity(manager: Manager): void {
		let payment: number = 0;
		const houseDemand = this.building.getDemand();
		const electricityBuyPrice = manager.building.electricityBuyPrice;
		const currencyDifference = this.currency - houseDemand * electricityBuyPrice;
		const hBattery = this.building.battery;
		const pBattery = manager.building.battery;
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
		if (!this.isBlocked) {
			const powerPlant = manager.building;
			if (manager.currency > 0) {
				const payment = powerPlant.calculateElectricityPrice(this.building.electricityOutput);
				if (manager.currency >= payment) {
					powerPlant.battery.buffer += this.building.electricityOutput;
					this.currency += payment;
					manager.currency -= payment;
				} else {
					// The manager could not afford all of the electricity, buy as much is possible
					const maxAffordableElectricity = manager.currency / powerPlant.electricitySellPrice;
					const unsoldElectricity = this.building.electricityOutput - maxAffordableElectricity;
					powerPlant.battery.buffer += maxAffordableElectricity;
					this.currency += manager.currency;
					manager.currency = 0;
					// Put as much of the unsold the electricity as possible back in the house battery, the rest gets wasted
					this.building.battery.buffer = Math.min(this.building.battery.buffer + unsoldElectricity, this.building.battery.capacity);
				}
			} else {
				// Put as much of the unsold electricity as possible back in the house battery, the rest gets wasted
				this.building.battery.buffer = Math.min(this.building.battery.buffer + this.building.electricityOutput, this.building.battery.capacity);
			}
		}
	}

	public blockSellElectricity(seconds: number) {
		this.isBlocked = true;
		setTimeout(() => {this.isBlocked = false}, seconds*1000);
	}
}

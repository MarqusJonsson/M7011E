import { BaseUser } from './baseUser';
import { House } from '../buildings/house';
import { Manager } from './manager';

export class Prosumer extends BaseUser<House> {
	private _isBlocked: boolean = false;
	private _timeLeftBlockedS: number = 0;
	private _timeLeftOnlineS: number = 0;
	private _isOnline: boolean = false;
	private static readonly ONLINE_TIME_AFTER_REQUEST = 5; // seconds

	constructor(currency: number = 0, house: House, id?: number) {
		super(Prosumer.name, currency, house, id);
	}

	public update(deltaTimeS: number, simulationTime: number) {
		this._timeLeftOnlineS -= deltaTimeS;
		if (this._timeLeftOnlineS <= 0) {
			this._timeLeftOnlineS = 0;
			this._isOnline = false;
		}
		this._timeLeftBlockedS -= deltaTimeS;
		if (this._timeLeftBlockedS <= 0) {
			this._timeLeftBlockedS = 0;
			this._isBlocked = false;
		}
	}

	public buyElectricity(manager: Manager): void {
		let payment: number = 0;
		const electricityToBuy = this.building.getDemand() * (1 - this.building.underproductionRatio);
		const electricityBuyPrice = manager.building.electricityBuyPrice;
		const currencyDifference = this.currency - electricityToBuy * electricityBuyPrice;
		const hBattery = this.building.battery;
		const pBattery = manager.building.battery;
		if (electricityToBuy > 0){
			if (currencyDifference >= 0){
				// Power plant has more than enough electricity, buy everything
				if (electricityToBuy <= pBattery.buffer){
					payment = electricityToBuy * electricityBuyPrice;
					pBattery.buffer -= electricityToBuy;
					hBattery.buffer += electricityToBuy;
				}
				// Buy electricity that is available from power plant
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
	}

	public sellElectricity(manager: Manager) {
		if (!this.isBlocked) {
			let unsoldElectricity = this.building.electricityOutput;
			if (manager.currency > 0) {
				const powerPlant = manager.building;
				const soldElectricity = Math.min(
					manager.currency / powerPlant.electricitySellPrice,	// Maximum electricity manager can afford
					powerPlant.battery.capacity - powerPlant.battery.buffer, // Maximum electricity manager can store
					this.building.electricityOutput // Produced electricity
				);
				unsoldElectricity = this.building.electricityOutput - soldElectricity;
				const soldElectricityCost = powerPlant.calculateElectricityPrice(soldElectricity);
				powerPlant.battery.buffer += soldElectricity;
				this.currency += soldElectricityCost;
				manager.currency -= soldElectricityCost;
			}
			// Put as much of the unsold the electricity as possible back in the house battery, the rest gets wasted
			this.building.battery.buffer = Math.min(this.building.battery.buffer + unsoldElectricity, this.building.battery.capacity);
		}
	}

	public requestReceived() {
		this._timeLeftOnlineS = Prosumer.ONLINE_TIME_AFTER_REQUEST;
		this._isOnline = true;
	}

	public blockSellElectricity(seconds: number) {
		this._isBlocked = true;
		this._timeLeftBlockedS = seconds;
	}

	public get isOnline(): boolean {
		return this._isOnline;
	}

	public get isBlocked(): boolean {
		return this._isBlocked;
	}
}

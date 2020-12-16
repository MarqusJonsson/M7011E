import {BaseBuilding} from './baseBuilding';
import {Battery} from './components/battery';
import {GeoData} from './components/geoData';
import {BaseGenerator} from '../generators/baseGenerator';

export abstract class BasePowerPlant extends BaseBuilding {
	private _modelledElectricityBuyPrice: number = 0;
	private _modelledElectricitySellPrice: number = 0;
	private _electricityBuyPrice: number = 0;
	private _electricitySellPrice: number = 0;
	private _startUpTime: number = 30;
	private _productionLowerCutOff: number = 0.2;
	private _productionUpperCutOff: number = 0.6;
	private _productionFlag: boolean = true;
	private _totalDemand: number = 0;

	constructor(type: string, battery: Battery, geoData: GeoData, generators: BaseGenerator[]) {
		super(type, battery, geoData, generators);
	}

	public generateElectricity(): void {
		const battery: Battery = this.battery;
		if (this.productionFlag) {
			const batteryElectricityAfterGeneration = battery.buffer + this.electricityProduction;
			if (batteryElectricityAfterGeneration <= battery.capacity) {
				battery.buffer = batteryElectricityAfterGeneration;
				if (battery.buffer > battery.capacity * this.productionUpperCufOff){
					this.productionFlag = false;
				}
			} 
			else {
				battery.buffer = battery.capacity;
				this.productionFlag = false;
			}
		} 
		else if (battery.buffer <= battery.capacity * this.productionLowerCufOff){
			this.productionFlag = true;
		}
	}

	public calculateElectricityPrice(amount: number): number {
		return amount * this.electricitySellPrice;
	}

	public get electricityBuyPrice(): number{
		return this._electricityBuyPrice;
	}

	public set electricityBuyPrice(value: number){
		this._electricityBuyPrice = value;
	}

	public get electricitySellPrice(): number{
		return this._electricitySellPrice;
	}

	public set electricitySellPrice(value: number){
		this._electricitySellPrice = value;
	}

	public get modelledElectricityBuyPrice(): number{
		return this._electricityBuyPrice;
	}

	public set modelledElectricityBuyPrice(value: number){
		this._electricityBuyPrice = value;
	}

	public get modelledElectricitySellPrice(): number{
		return this._electricitySellPrice;
	}

	public set modelledElectricitySellPrice(value: number){
		this._electricitySellPrice = value;
	}

	public get startUpTime(): number {
		return this._startUpTime;
	}

	public set startUpTime(value: number) {
		this._startUpTime = value;
	}

	public get productionLowerCufOff(): number {
		return this._productionLowerCutOff;
	}

	public set productionLowerCutOff(value: number) {
		this._productionLowerCutOff = value;
	}

	public get productionUpperCufOff(): number {
		return this._productionUpperCutOff;
	}

	public set productionUpperCutOff(value: number) {
		this._productionUpperCutOff = value;
	}

	public get productionFlag(): boolean {
		return this._productionFlag;
	}

	public set productionFlag(value: boolean) {
		this._productionFlag = value;
	}

	public get totalDemand(): number {
		return this._totalDemand;
	}

	public set totalDemand(value: number) {
		this._totalDemand = value;
	}
}

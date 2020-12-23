import {BaseBuilding} from './baseBuilding';
import {Battery} from './components/battery';
import {GeoData} from './components/geoData';
import {BaseGenerator} from '../generators/baseGenerator';
import { Ws_per_kWh } from '../math/electricity';

export abstract class BasePowerPlant extends BaseBuilding {
	private _modelledElectricityBuyPrice: number = 0;
	private _modelledElectricitySellPrice: number = 0;
	private _electricityBuyPrice: number = 1.5 / Ws_per_kWh;
	private _electricitySellPrice: number = 1.5 / Ws_per_kWh;
	private _startUpTimeS: number = 30;
	private _productionLowerCutOff: number = 0.2;
	private _productionUpperCutOff: number = 0.6;
	private _productionFlag: boolean = true;
	private _totalDemand: number = 0;
	private _productionOutputRatio = 1;

	constructor(type: string, battery: Battery, geoData: GeoData, generators: BaseGenerator[]) {
		super(type, battery, geoData, generators);
	}

	public generateElectricity(): void {
		const battery: Battery = this.battery;
		if (this.productionFlag) {
			const batteryElectricityAfterGeneration = battery.buffer + this.electricityProduction * this.productionOutputRatio;
			if (batteryElectricityAfterGeneration <= battery.capacity) {
				battery.buffer = batteryElectricityAfterGeneration;
			} 
			else {
				battery.buffer = battery.capacity;			}
		} 
	}

	public calculateElectricityPrice(amount: number): number {
		return amount * this.electricitySellPrice;
	}

	public start() {
		this.productionFlag = true;
	}

	public stop() {
		this.productionFlag = false;
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
		return this._modelledElectricityBuyPrice;
	}

	public set modelledElectricityBuyPrice(value: number){
		this._modelledElectricityBuyPrice = value;
	}

	public get modelledElectricitySellPrice(): number{
		return this._modelledElectricitySellPrice;
	}

	public set modelledElectricitySellPrice(value: number){
		this._modelledElectricitySellPrice = value;
	}

	public get startUpTime(): number {
		return this._startUpTimeS;
	}

	public set startUpTime(value: number) {
		this._startUpTimeS = value;
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

	public get productionOutputRatio(): number {
		return this._productionOutputRatio;
	}

	public set productionOutputRatio(value: number) {
		this._productionOutputRatio = value;
	}
}

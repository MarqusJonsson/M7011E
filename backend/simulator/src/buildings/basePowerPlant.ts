import {BaseBuilding} from './baseBuilding';
import {Battery} from './components/battery';
import {GeoData} from './components/geoData';
import {BaseGenerator} from '../generators/baseGenerator';
import { Ws_per_kWh } from '../math/electricity';
import { powerPlantActionDelayTimeS } from '../math/time';

export abstract class BasePowerPlant extends BaseBuilding {
	private _modelledElectricityBuyPrice: number = 0;
	private _modelledElectricitySellPrice: number = 0;
	private _electricityBuyPrice: number = 1.5 / Ws_per_kWh;
	private _electricitySellPrice: number = 1.5 / Ws_per_kWh;
	private _productionFlag: boolean = true;
	private _totalDemand: number = 0;
	private _productionOutputRatio = 1;
	private _actionDelayTimeS: number = 0;
	private _action: Function | undefined = undefined;
	private _actionDescription: string = '';

	constructor(type: string, battery: Battery, geoData: GeoData, generators: BaseGenerator[]) {
		super(type, battery, geoData, generators);
	}

	public update(deltaTimeS: number, simulationTime: number) {
		if (this._action !== undefined) {
			this.actionDelayTimeS -= deltaTimeS;
			if (this.actionDelayTimeS <= 0) {
				// Execute action
				this._action();
				// Clear action
				this._action = undefined;
				this._actionDescription = '';
			}
		}
	}

	public calculateProduction(deltaTimeS: number): number {
		this.electricityProduction = 0;
		if (!this.hasBlackout && this.productionFlag) {
			this.generators.forEach((generator) => {
				this.electricityProduction += generator.calculateOutput(this.geoData);
			});
			this.electricityProduction *= deltaTimeS * this.productionOutputRatio;
		}
		return this.electricityProduction;
	}

	public generateElectricity(): void {
		const battery: Battery = this.battery;
		if (this.productionFlag) {
			battery.buffer = Math.min(battery.buffer + this.electricityProduction, battery.capacity);
		} 
	}

	public consumeElectricity() {
		const remainingElectricity = this.battery.buffer - this.electricityConsumption;
		if (!this.hasBlackout) {
			if (remainingElectricity < 0) {
				this.hasBlackout = true;
				this.battery.buffer = 0;
			}
			else {
				this.battery.buffer = remainingElectricity;
			}
		}
		else if (remainingElectricity >= 0) {
			this.hasBlackout = false;
			this.battery.buffer = remainingElectricity;
		}
	}

	public calculateElectricityPrice(amount: number): number {
		return amount * this.electricitySellPrice;
	}

	public start() {
		if (this._action === undefined && !this.productionFlag) {
			this._actionDescription = 'Starting';
			this.actionDelayTimeS = powerPlantActionDelayTimeS;
			this._action = () => {
				this.productionFlag = true;
			}
		}
	}

	public stop() {
		if (this._action === undefined && this.productionFlag) {
			this._actionDescription = 'Stopping';
			this.actionDelayTimeS = powerPlantActionDelayTimeS;
			this._action = () => {
				this.productionFlag = false;
			}
		}
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

	public get actionDelayTimeS(): number {
		return this._actionDelayTimeS;
	}

	public set actionDelayTimeS(value: number) {
		this._actionDelayTimeS = Math.max(value, 0);
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

	public get actionDescription(): string {
		return this._actionDescription;
	}
}

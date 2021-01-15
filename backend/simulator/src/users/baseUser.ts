import { BaseBuilding } from '../buildings/baseBuilding';
import { Identifiable } from '../identifiable';

export abstract class BaseUser<Building extends BaseBuilding> extends Identifiable {
	private _currency: number;
	private _building: Building;
	
	constructor(type: string, currency: number = 0, building: Building, id?: number) {
		super(type, id);
		this._currency = currency;
		this._building = building;
	}

	public update(deltaTimeS: number, simulationTime: number) {
		this.building.update(deltaTimeS, simulationTime);
	}
	
	public get currency(): number {
		return this._currency;
	}
	
	public set currency(value: number) {
		if (value < 0) {
			throw new Error('Value can not be less than 0');
		}
		this._currency = value;
	}

	public get building(): Building {
		return this._building;
	}
}

import { Identifiable } from "../../identifiable";

export class Battery extends Identifiable {
	private _buffer: number;
	private _capacity: number;

	constructor(capacity: number, buffer: number = 0) {
		super(Battery.name);
		this._capacity = capacity;
		this._buffer = buffer;
	}
	
	public canSupply(amount: number) : boolean {
		return this.buffer >= amount ? true : false;
	}

	public get buffer(): number {
		return this._buffer;
	}

	public set buffer(value: number) {
		if (value > this._capacity) {
			throw new Error("value cannot be larger than the capacity of " + this._capacity);
		}
		else if (value < 0){
			throw new Error("value cannot be smaller than 0");
		}
		this._buffer = value;
	}

	public get capacity(): number {
		return this._capacity;
	}

	public set capacity(value: number) {
		if (value < 0) {
			throw new Error('value cannot be less than 0');
		}
		this._capacity = value;
	}
}
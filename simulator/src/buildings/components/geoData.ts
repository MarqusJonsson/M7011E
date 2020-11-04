import { Identifiable } from "../../identifiable";

export class GeoData extends Identifiable {
	private _longitude: number;
	private _latitude: number;
	private _altitude: number;
	
	constructor(longitude: number = 0, latitude: number = 0, altitude: number = 0) {
		super(GeoData.name);
		this._longitude = longitude;
		this._latitude = latitude;
		this._altitude = altitude;
	}
	
	public get longitude(): number{
		return this._longitude;
	}
	
	public set longitude(longitude: number){
		this._longitude = longitude;
	}
	
	public get latitude(): number{
		return this._latitude;
	}

	public set latitude(latitude: number){
		this._latitude = latitude;
	}
	
	public get altitude(): number{
		return this._altitude;
	}

	public set altitude(altitude: number){
		this._altitude = altitude;
	}
}
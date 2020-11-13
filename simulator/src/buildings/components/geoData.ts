import { Identifiable } from '../../identifiable';
import { randomFromInterval } from '../../math/random';

const GEO_DATA_MAX = 360;
const GEO_DATA_MIN = 0;
export class GeoData extends Identifiable {
	private _longitude: number;
	private _latitude: number;
	private _altitude: number;
	
	constructor(
		longitude: number = randomFromInterval(GEO_DATA_MIN, GEO_DATA_MAX),
		latitude: number = randomFromInterval(GEO_DATA_MIN, GEO_DATA_MAX),
		altitude: number = randomFromInterval(GEO_DATA_MIN, GEO_DATA_MAX)) {
		super(GeoData.name);
		this._longitude = longitude;
		this._latitude = latitude;
		this._altitude = altitude;
	}

	public distance(target: GeoData): number {
		const longitude = target.longitude - this.longitude;
		const latitude = target.latitude - this.latitude;
		const altitude = target.altitude - this.altitude;
		return Math.sqrt(longitude * longitude + latitude * latitude + altitude * altitude);
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
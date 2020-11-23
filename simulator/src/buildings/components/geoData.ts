import { Environment } from '../../environment';
import { Identifiable } from '../../identifiable';
import { randomFromInterval } from '../../math/random';

const GEO_DATA_MAX = 360;
const GEO_DATA_MIN = 0;
export class GeoData extends Identifiable {
	private _longitude: number;
	private _latitude: number;
	private _altitude: number;
	private _windSpeed: number;
	private _temperature: number;
	
	constructor(
		longitude: number = randomFromInterval(GEO_DATA_MIN, GEO_DATA_MAX),
		latitude: number = randomFromInterval(GEO_DATA_MIN, GEO_DATA_MAX),
		altitude: number = randomFromInterval(GEO_DATA_MIN, GEO_DATA_MAX)
		) {
		super(GeoData.name);
		this._longitude = longitude;
		this._latitude = latitude;
		this._altitude = altitude;
		this._windSpeed = 0;
		this._temperature = 0;
	}

	public sampleEnviornmentVariables(environment: Environment, simulationTime: number) {
		const simulationDate = new Date(simulationTime);
		this.windSpeed = environment.sampleWindSpeed(this.longitude, this.latitude);
		this.temperature = environment.sampleTemperature(this.longitude, this.latitude, simulationDate.getMonth());
	}

	public distance(target: GeoData): number {
		const longitude = target.longitude - this.longitude;
		const latitude = target.latitude - this.latitude;
		const altitude = target.altitude - this.altitude;
		return Math.sqrt(longitude * longitude + latitude * latitude + altitude * altitude);
	}
	
	public get longitude(): number {
		return this._longitude;
	}
	
	public set longitude(longitude: number) {
		this._longitude = longitude;
	}
	
	public get latitude(): number {
		return this._latitude;
	}

	public set latitude(latitude: number) {
		this._latitude = latitude;
	}
	
	public get altitude(): number {
		return this._altitude;
	}

	public set altitude(altitude: number) {
		this._altitude = altitude;
	}

	public get windSpeed(): number {
		return this._windSpeed;
	}

	public set windSpeed(windSpeed: number) {
		this._windSpeed = windSpeed;
	}

	public get temperature(): number {
		return this._temperature;
	}

	public set temperature(temperature: number) {
		this._temperature = temperature;
	}
}

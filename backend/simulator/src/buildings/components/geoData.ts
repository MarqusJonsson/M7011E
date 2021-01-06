import { Environment } from '../../environment';
import { Identifiable } from '../../identifiable';
import { randomFromInterval } from '../../math/random';

export class Location {
	static readonly MAX = 360;
	static readonly MIN = 0;

	constructor(
		private _longitude: number,
		private _latitude: number,
		private _altitude: number
	) {};

	public get longitude() {
		return this._longitude;
	}

	public get latitude() {
		return this._latitude;
	}

	public get altitude() {
		return this._altitude;
	}
}

export class GeoData extends Identifiable {
	private _windSpeed: number;
	private _temperature: number;
	private _location: Location;

	constructor(
		longitude: number = randomFromInterval(Location.MIN, Location.MAX),
		latitude: number = randomFromInterval(Location.MIN, Location.MAX),
		altitude: number = randomFromInterval(Location.MIN, Location.MAX)
	) {
		super(GeoData.name);
		this._location = new Location(longitude, latitude, altitude);
		this._windSpeed = 0;
		this._temperature = 0;
	}

	public sampleEnvironmentVariables(environment: Environment, simulationTime: number) {
		this.windSpeed = environment.sampleWindSpeed(this.longitude, this.latitude, simulationTime);
		this.temperature = environment.sampleTemperature(this.longitude, this.latitude, simulationTime);
	}

	public distance(target: GeoData): number {
		const longitude = target.longitude - this.longitude;
		const latitude = target.latitude - this.latitude;
		const altitude = target.altitude - this.altitude;
		return Math.sqrt(longitude * longitude + latitude * latitude + altitude * altitude);
	}
	
	public get longitude(): number {
		return this._location.longitude;
	}
	
	public get latitude(): number {
		return this._location.latitude;
	}

	public get altitude(): number {
		return this._location.altitude;
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

import { Location } from "./buildings/components/geoData";
import { geoDatabilinearInterpolation, linearInterpolation } from "./math/interpolation";
import { ms_to_YMDHMSM, YMDHMSM } from "./math/time";

export class GeoDataMapPair {
	private previous: GeoDataMap;
	private next: GeoDataMap;
	private sampleTimeDelta_ms: number = 12 * 60 * 60 * 1000;

	constructor(
		private longitudePoints: number,
		private latitudePoints: number,
		private altitudePoints: number,
		time: number,
		private sampleDataPoint: (time: YMDHMSM, normalizedLocation: Location) => number
	) {
		this.previous = new GeoDataMap(longitudePoints, latitudePoints, altitudePoints, time, sampleDataPoint);
		this.next = new GeoDataMap(longitudePoints, latitudePoints, altitudePoints, time + this.sampleTimeDelta_ms, sampleDataPoint);
	}
	// TODO: Needs cleanup, handle 3d maps (currently only 2d since only using 1 element in altitude dimension)
	public sample(time: number, normalizedLocation: Location): number {
		if (!(this.previous.time <= time && this.next.time >= time)) {
			this.previous.setDataPoints(this.next.data, this.next.time);
			this.next.sampleDataPoints(this.longitudePoints, this.latitudePoints, this.altitudePoints, time + this.sampleTimeDelta_ms, this.sampleDataPoint);
		}
		const longitude = normalizedLocation.longitude * (this.longitudePoints - 1);
		const latitude = normalizedLocation.latitude * (this.latitudePoints - 1);
		const altitude = normalizedLocation.altitude * (this.altitudePoints - 1);
		
		const p = new Location(longitude, latitude, altitude);
		const lowerLongitudeIndex = Math.floor(longitude) % this.longitudePoints;
		const upperLongitudeIndex = (lowerLongitudeIndex + 1) % this.longitudePoints;
		const lowerLatitudeIndex = Math.floor(latitude) % this.latitudePoints;
		const upperLatitudeIndex = (lowerLatitudeIndex + 1) % this.latitudePoints;
		//const lowerAltitudeIndex = Math.floor(altitude) % this.altitudePoints;
		//const upperAltitudeIndex = (lowerAltitudeIndex+ 1) % this.altitudePoints;
		const q11 = new Location(lowerLongitudeIndex, lowerLatitudeIndex, 0);
		const q12 = new Location(lowerLongitudeIndex, upperLatitudeIndex, 0);
		const q21 = new Location(upperLongitudeIndex, lowerLatitudeIndex, 0);
		const q22 = new Location(upperLongitudeIndex, upperLatitudeIndex, 0);
		const q11Value_p = this.previous.data[q11.longitude][q11.latitude][q11.altitude]; 
		const q21Value_p = this.previous.data[q21.longitude][q21.latitude][q21.altitude];
		const q12Value_p = this.previous.data[q12.longitude][q12.latitude][q12.altitude];
		const q22Value_p = this.previous.data[q22.longitude][q22.latitude][q22.altitude];
		const i_p = geoDatabilinearInterpolation(q11, q11Value_p, q21, q21Value_p, q12, q12Value_p, q22, q22Value_p, p);

		const q11Value_n = this.next.data[q11.longitude][q11.latitude][q11.altitude]; 
		const q21Value_n = this.next.data[q21.longitude][q21.latitude][q21.altitude];
		const q12Value_n = this.next.data[q12.longitude][q12.latitude][q12.altitude];
		const q22Value_n = this.next.data[q22.longitude][q22.latitude][q22.altitude];
		const i_n = geoDatabilinearInterpolation(q11, q11Value_n, q21, q21Value_n, q12, q12Value_n, q22, q22Value_n, p);

		const percent = 1 - (this.next.time - time) / (this.next.time - this.previous.time);
		const res = linearInterpolation(i_p, i_n, percent);
		return res;
	}
}

export class GeoDataMap {
	private _data: number[][][] = [];
	public time: number;
	constructor(
		longitudePoints: number,
		latitudePoints: number,
		altitudePoints: number,
		time: number,
		sampleDataPoint: (time: YMDHMSM, normalizedLocation: Location) => number,
	) {
		this.time = time;
		this.sampleDataPoints(longitudePoints, latitudePoints, altitudePoints, time, sampleDataPoint);
	}

	// TODO: handle 3d maps (currently only 2d since only 1 element in altitude dimension)
	public sampleDataPoints(
		longitudePoints: number,
		latitudePoints: number,
		altitudePoints: number,
		time: number,
		sampleDataPoint: (time: YMDHMSM, normalizedLocation: Location) => number,
	) {
		this.time = time;
		const ymdhmsm = ms_to_YMDHMSM(time);
		this._data = [];
		for (let i = 0; i < longitudePoints; i++) {
			const lastLongitude = i === longitudePoints - 1;
			this._data.push([]);
			for (let j = 0; j < latitudePoints; j++) {
				const lastLatitude = j === latitudePoints - 1;
				this._data[i].push([]);
				for (let k = 0; k < altitudePoints; k++) {
					let dataPoint: number;
					if (lastLongitude && lastLatitude) {
						dataPoint = this._data[0][0][k];
					} else if (lastLatitude) {
						dataPoint = this._data[i][0][k];
					} else if (lastLongitude) {
						dataPoint = this._data[0][j][k];
					} else {
						dataPoint = sampleDataPoint(ymdhmsm, new Location(i / longitudePoints, j / latitudePoints, k / altitudePoints));
					}
					this._data[i][j].push(dataPoint);
				}
			}
		}
	}

	public setDataPoints(value: number[][][], time: number) {
		this.time = time;
		this._data = value;
	}

	public get data(): number[][][] {
		return this._data;
	}
}

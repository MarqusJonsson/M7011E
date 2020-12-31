import { Location } from './buildings/components/geoData';
import { GeoDataMap, GeoDataMapPair } from './geoDataMap';
import { GaussianDistribution } from './math/gaussianDistribution';
import { linearInterpolation } from './math/interpolation';
import { MONTH_MEAN_TEMPERATURES } from './utils/realLifeData';

// Setup distributions for each month mean temperatures
const meanTempVariance = 10;
const janDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[0], meanTempVariance);
const febDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[1], meanTempVariance);
const marDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[2], meanTempVariance);
const aprilDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[3], meanTempVariance);
const mayDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[4], meanTempVariance);
const juneDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[5], meanTempVariance);
const juliDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[6], meanTempVariance);
const augDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[7], meanTempVariance);
const sepDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[8], meanTempVariance);
const octDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[9], meanTempVariance);
const novDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[10], meanTempVariance);
const decDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[11], meanTempVariance);
const monthlyTemperatureDistributions: GaussianDistribution[] = [
	janDistribution, febDistribution, marDistribution, aprilDistribution, 
	mayDistribution, juneDistribution, juliDistribution, augDistribution,
	sepDistribution, octDistribution, novDistribution, decDistribution
];
const windSpeedDist: GaussianDistribution = new GaussianDistribution(0, 140);

export class Environment {
	private _time: number;

	constructor(time: number) {
		this._time = time;
	}

	// TODO: Needs cleanup
	private temperatureMap: GeoDataMapPair = new GeoDataMapPair(10, 10, 1, 0, (time, normalizedLocation) => {
		const lowTempTime = 3;
		const lowTempHighTempDiff = 7;
		const monthTemperatureSample = monthlyTemperatureDistributions[time.months].sample();
		const diff = Math.abs(time.hours - lowTempTime);
		let timeFactor;
		if (diff < 12) {
			timeFactor = diff / 12;
		} else {
			timeFactor = (24 - diff) / 12;
		}
		return linearInterpolation(monthTemperatureSample - lowTempHighTempDiff / 2, monthTemperatureSample + lowTempHighTempDiff / 2, timeFactor);
	});

	private windMap: GeoDataMapPair = new GeoDataMapPair(10, 10, 1, 0, (time, normalizedLocation) => {
		const sample = Math.abs(windSpeedDist.sample());
		return sample;
	});

	public sampleWindSpeed(longitude: number, latitude: number, time: number): number {
		return this.windMap.sample(time, new Location(longitude / Location.MAX, latitude / Location.MAX, 0));
	}

	public sampleTemperature(longitude: number, latitude: number, time: number): number { 
		return this.temperatureMap.sample(time, new Location(longitude / Location.MAX, latitude / Location.MAX, 0));
	}

	public get time(): number {
		return this._time;
	}

	public set time(value: number) {
		this._time = value;
	}
}

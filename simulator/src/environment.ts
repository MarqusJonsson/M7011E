import { GaussianDistribution } from './math/gaussianDistribution';
export class Environment {
	private _time: number;
	private _dist: GaussianDistribution;
	private _monthMeanTemperatureDistributions: Array<GaussianDistribution>;
	constructor(time: number, windSpeedMean: number = 0, windSpeedVariance: number = 20, monthMeanTemperatureDistributions: Array<GaussianDistribution> = []) {
		this._time = time;
		this._dist = new GaussianDistribution(windSpeedMean, windSpeedVariance);
		this._monthMeanTemperatureDistributions = monthMeanTemperatureDistributions;
	}

   public sampleWindSpeed(longitude: number, latitude: number, time: number = Date.now()): number {
		return this._dist.sample();
	}

	public cosInterpolatation(x: number, y: number, angle: number): number{
		let a: number = angle;
		let prc: number = 0.5*(1-Math.cos(a));
		return x*(1.0 - prc) + y*prc;
	}

	public sampleTemperature(longitude: number, latitude: number, month: number): number { 
		return this._monthMeanTemperatureDistributions[month].sample();
	}
/*
	public biCubicInterPolation(interpolationPoint: GeoData, time: number, worldPoints: number[], x1y1: GeoData, x1y2: GeoData, x2y2: GeoData, ){
		//let w_rSum: number[] = [x.length];
		//let q: number[] = [x.length];
		let w_r: number;
		let q: number;
		let f_r = 0.5;

		let d_r_squared: number = (longitude-worldPoints.x)^2 +  (latitude-worldPoints.y^2)
		w_r = 1 / d_r_squared;
		q = w_r * f_r / w_r;

		// for(let i: number = 0; i < x.length; i++){
		//	 let d_r_squaredSum: number = (x[x.length-1]-x[i])^2 +  (y[y.length-1]-y[i])^2 + (z[z.length-1]-z[i])^2;
		//	 w_rSum[i] = 1 / d_r_squaredSum;

		//	 q[i] = w_rSum[i] * f_r / w_rSum[i];
		// }
 
		return q;


	}
*/
	public get time(): number {
		return this._time;
	}

	public set time(value: number) {
		this._time = value;
	}

	public get monthMeanTemperatureDistributions(): Array<GaussianDistribution> {
		return this._monthMeanTemperatureDistributions;
	}

	public set monthMeanTemperatureDistributions(distributions: Array<GaussianDistribution>) {
		this._monthMeanTemperatureDistributions = distributions;
	}
}
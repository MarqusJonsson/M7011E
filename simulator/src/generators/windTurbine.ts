import { BaseGenerator } from './baseGenerator';
import { GeoData } from '../buildings/components/geoData';
import { Environment } from '../environment';
export class WindTurbine extends BaseGenerator {
	constructor(baseOutput: number = 0) {
		super(baseOutput);
	}
	
	public calculateOutput(environment: Environment, geoData: GeoData): number {
		if (this.isBroken) return 0;
		const windSpeed = Math.abs(environment.sampleWindSpeed(geoData.longitude, geoData.latitude));
		if (windSpeed < 2 || windSpeed > 25) this.output = 0;
		else if (windSpeed < 14) this.output = 7 * Math.pow(windSpeed, 2) * this.baseOutput / 1372;
		else this.output = (-70 * windSpeed + 2352) * this.baseOutput / 1372;
		return this.output;
	}
}

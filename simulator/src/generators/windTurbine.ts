import { BaseGenerator } from './baseGenerator';
import { GeoData } from '../buildings/components/geoData';

export class WindTurbine extends BaseGenerator {
	constructor(baseOutput: number = 0) {
		super(baseOutput);
	}
	
	public calculateOutput(geoData: GeoData): number {
		if (this.isBroken) return 0;
		const absWindSpeed = Math.abs(geoData.windSpeed);
		// Electricity output function https://www.desmos.com/calculator/unc2ipkciv
		if (absWindSpeed < 2 || absWindSpeed > 25) this.output = 0;
		else if (absWindSpeed < 14) this.output = 7 * Math.pow(absWindSpeed, 2) * this.baseOutput / 1372;
		else this.output = (-70 * absWindSpeed + 2352) * this.baseOutput / 1372;
		return this.output;
	}
}

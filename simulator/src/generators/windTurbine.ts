import { BaseGenerator } from './baseGenerator';
import { GeoData } from '../buildings/components/geoData';
import { BaseBuilding } from '../buildings/baseBuilding';

export class WindTurbine extends BaseGenerator {
	constructor(baseOutput: number = 0) {
		super(baseOutput);
	}
	
	public calculateOutput(): number {
		const parentBuilding: BaseBuilding | undefined = this.parentBuilding;
		if (!parentBuilding) throw new Error('Can not calculate the output of a generator without a parentBuilding');
		else if (this.isBroken) return 0;
		const geoData: GeoData = parentBuilding.geoData;
		const windSpeed = Math.abs(parentBuilding.environment.sampleWindSpeed(geoData.longitude, geoData.latitude));
		if (windSpeed < 2 || windSpeed > 25) this.output = 0;
		else if (windSpeed < 14) this.output = 7 * Math.pow(windSpeed, 2) * this.baseOutput / 1372;
		else this.output = (-70 * windSpeed + 2352) * this.baseOutput / 1372;
		console.log("WS: " + windSpeed + " WITH BASE: " + this.baseOutput);
		return this.output;
	}
}

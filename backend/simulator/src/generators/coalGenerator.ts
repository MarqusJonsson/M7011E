import { BaseGenerator } from './baseGenerator';
import { GeoData } from '../buildings/components/geoData';

export class CoalGenerator extends BaseGenerator {
	constructor(baseOutput: number = 0, isBroken: boolean = false, pollution: number = 0) {
		super(baseOutput, isBroken, pollution);
	}

	public calculateOutput(geoData: GeoData): number {
		if (this.isBroken) this.output = 0;
		else this.output = this.baseOutput;
		return this.output;
	}
}

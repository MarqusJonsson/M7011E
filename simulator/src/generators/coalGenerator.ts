import { BaseGenerator } from './baseGenerator';
import { Environment } from '../environment';
import { GeoData } from '../buildings/components/geoData';

export class CoalGenerator extends BaseGenerator {
    constructor(baseOutput: number = 0, isBroken: boolean = false, pollution: number = 0) {
        super(baseOutput, isBroken, pollution);
    }

    public calculateOutput(environment: Environment, geoData: GeoData): number {
		if (this.isBroken) this.output = 0;
		else this.output = this.baseOutput;
        return this.output;
    }
}

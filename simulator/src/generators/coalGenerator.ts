import { BaseGenerator } from './baseGenerator';
import { BaseBuilding } from '../buildings/baseBuilding';

export class CoalGenerator extends BaseGenerator {
    constructor(baseOutput: number = 0, isBroken: boolean = false, parentBuilding?: BaseBuilding, pollution: number = 0) {
        super(baseOutput, isBroken, parentBuilding, pollution);
    }

    public calculateOutput(): number {
        if (!this.parentBuilding) throw new Error('Can not calculate the output of a generator without a parentBuilding');
        else if (this.isBroken) return 0;
        return this.baseOutput;
    }
}

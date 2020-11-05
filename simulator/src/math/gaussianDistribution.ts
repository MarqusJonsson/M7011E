import { Gaussian } from 'ts-gaussian';

export class GaussianDistribution {
    private _distribution: Gaussian;
    
    constructor(mean: number, variance: number) {
        this._distribution = new Gaussian(mean, variance);
    }

    public sample() {
        return this._distribution.ppf(Math.random());
    }
}
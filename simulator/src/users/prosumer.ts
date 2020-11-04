import { BaseUser } from './baseUser';
import { House } from '../buildings/house';

export class Prosumer extends BaseUser {
    private _houses: House[];

    constructor(currency: number = 0, houses: House[] = []) {
        super(Prosumer.name, currency);
        this._houses = houses;
    }
    
    
    public get houses() : House[] {
        return this._houses;
    }

    public set houses(houses: House[]) {
        this._houses = houses;
    }


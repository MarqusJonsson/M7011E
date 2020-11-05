import { BaseUser } from './baseUser';
import { House } from '../buildings/house';

export class Prosumer extends BaseUser {
    private _houses: House[];

    constructor(currency: number = 0, houses: House[] = []) {
        super(Prosumer.name, currency);
        this._houses = houses;
    }
    
    public setBatteryToPowerPlantRatio(houseId: number, ratio: number) {
        let house: House | undefined = this.houses.find(house => house.id === houseId);
        if (house === undefined) {
            throw new Error('house with given houseId is not owned by this prosumer');
        }
        house.batteryToPowerPlantRatio = ratio;
    }
    
    public get houses() : House[] {
        return this._houses;
    }

    public set houses(houses: House[]) {
        this._houses = houses;
    }

    public buyElectricity(deltaTimeS: number): void {
        for (const house of this.houses){
            let payment: number = 0;
            const houseDemand = house.getDemand(deltaTimeS);
            const electricityBuyPrice = house.powerPlantParent.electricityBuyPrice;
            const currencyDifference = this.currency - houseDemand * electricityBuyPrice;
            const hBattery = house.battery;
            const pBattery = house.powerPlantParent.battery;
            if (houseDemand > 0){
                if (currencyDifference >= 0){
                    if (houseDemand <= pBattery.buffer){
                        payment = houseDemand * electricityBuyPrice;
                        pBattery.buffer -= houseDemand;
                        hBattery.buffer += houseDemand;
                    }
                    else {
                        payment = pBattery.buffer * electricityBuyPrice;
                        hBattery.buffer += pBattery.buffer;
                        pBattery.buffer = 0;
                    }
                }
                else if (currencyDifference < 0){
                    const maxPossibleElectricity: number = this.currency / electricityBuyPrice;
                    if (maxPossibleElectricity <= pBattery.buffer){
                        payment = maxPossibleElectricity * electricityBuyPrice;
                        hBattery.buffer += maxPossibleElectricity;
                        pBattery.buffer -= maxPossibleElectricity;
                    }
                    else {
                        payment = pBattery.buffer * electricityBuyPrice;
                        hBattery.buffer += pBattery.buffer;
                        pBattery.buffer = 0;
                    }
                }
                house.powerPlantParent.manager.currency += payment;
                this.currency -= payment;
            }
            //else {
            //    console.log("Demand already satisfied");
            //}
        }
    }
}

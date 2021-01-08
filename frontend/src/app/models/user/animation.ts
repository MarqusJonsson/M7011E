export enum ParticleType {
	ELECTRICITY = 0,
	CURRENCY = 1
}

export interface HouseAnimationData {
	electricityProduction: number;
	electricityToBattery: number;
	electricityFromBattery: number;
	electricityConsumption: number;
	electricityToPowerPlant: number;
	electricityFromPowerPlant: number;
	currencyToPowerPlant: number;
	currencyFromPowerPlant: number;
}

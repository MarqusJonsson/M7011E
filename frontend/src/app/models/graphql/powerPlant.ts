import { Battery, batteryContent } from './battery';
import { GeoData, geoDataContent } from './geoData';

// Content
export const powerPlantContent = `
	powerPlant {
		electricityConsumption
		electricityProduction
		modelledElectricitySellPrice
		modelledElectricityBuyPrice
		electricitySellPrice
		electricityBuyPrice
		hasBlackout
		totalDemand
		productionOutputRatio
		delayTimeS
		productionFlag
		${batteryContent}
		${geoDataContent}
	}`;

export const prosumerPowerPlantContent = `
	powerPlant {
		electricitySellPrice
		electricityBuyPrice
	}`;

// Queries
export const powerPlantQuery = `
	query powerPlant {
		${powerPlantContent}
	}`;

// Mutations
export const updateElectricityPrices = `
	mutation updateElectricityPrices ($electricityBuyPrice: Float!, $electricitySellPrice: Float!) {
		updateElectricityPrices(electricityBuyPrice: $electricityBuyPrice, electricitySellPrice: $electricitySellPrice) {
			electricityBuyPrice
			electricitySellPrice
		}
	}`;

export const updateProductionOutputRatioMutation = `
	mutation updateProductionOutputRatio ($productionOutputRatio: Float!) {
		updateProductionOutputRatio(productionOutputRatio: $productionOutputRatio) {
			productionOutputRatio
		}
	}`;

export const startPowerPlantProductionMutation = `
	mutation startPowerPlantProduction {
		startPowerPlantProduction {
			productionFlag
		}
	}`;

export const stopPowerPlantProductionMutation = `
	mutation stopPowerPlantProduction {
		stopPowerPlantProduction {
			productionFlag
		}
	}`;

// Query results
export interface PowerPlantQueryResults {
	powerPlant: PowerPlant;
}

// Data structure
export interface PowerPlant {
	delayTimeS: number;
	electricityBuyPrice: number;
	electricitySellPrice: number;
	modelledElectricityBuyPrice: number;
	modelledElectricitySellPrice: number;
	electricityConsumption: number;
	electricityProduction: number;
	hasBlackout: boolean;
	productionFlag: boolean;
	productionOutputRatio: number;
	totalDemand: number;
	battery: Battery;
	geoData: GeoData;
}

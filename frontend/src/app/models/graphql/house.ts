import { Battery, batteryContent } from './battery';
import { GeoData, geoDataContent } from './geoData';
import { PowerPlant, prosumerPowerPlantContent } from './powerPlant';

// Content
export const houseContent = `
	house {
		electricityConsumption
		electricityProduction
		overproductionRatio
		underproductionRatio
		hasBlackout
		${batteryContent}
		${geoDataContent}
		${prosumerPowerPlantContent}
	}`;

export const houseContentWithLimitedPowerPlant = `
	house {
		electricityConsumption
		electricityProduction
		overproductionRatio
		underproductionRatio
		hasBlackout
		${batteryContent}
		${geoDataContent}
		powerPlant {
			electricityBuyPrice
			electricitySellPrice
		}
	}`;

// Queries
export const houseQuery = `
	query house {
		${houseContent}
	}`;

// Mutations
export const setHouseOverproductionRatioMutation = `
	mutation setOverproductionRatio ($ratio: Float!) {
		setOverproductionRatio (overproductionRatio: $ratio) {
			overproductionRatio
		}
	}`;

export const setHouseUnderproductionRatioMutation = `
	mutation setUnderproductionRatio ($ratio: Float!) {
		setUnderproductionRatio (underproductionRatio: $ratio) {
			underproductionRatio
		}
	}`;

// Query results
export interface HouseQueryResults {
	house: House;
}

// Data structure
export interface House {
	electricityConsumption: number;
	electricityProduction: number;
	overproductionRatio: number;
	underproductionRatio: number;
	hasBlackout: boolean;
	battery: Battery;
	geoData: GeoData;
	powerPlant: PowerPlant;
}

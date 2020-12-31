import { batteryContent } from './battery';
import { geoDataContent } from './geoData';
import { prosumerPowerPlantContent } from './powerPlant';

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

export const houseContentWithoutPowerPlant = `
	house {
		electricityConsumption
		electricityProduction
		overproductionRatio
		underproductionRatio
		hasBlackout
		${batteryContent}
		${geoDataContent}
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

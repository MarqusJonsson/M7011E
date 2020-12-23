import { batteryContent } from './batteryContent';
import { geoDataContent } from './geoDataContent';
import { generatorsContent } from './generatorsContent';

export const powerPlantContent = "powerPlant {electricityConsumption electricityProduction modelledElectricitySellPrice modelledElectricityBuyPrice electricitySellPrice electricityBuyPrice hasBlackout totalDemand productionOutputRatio " + batteryContent + geoDataContent + generatorsContent + "}";
export const powerPlantQuery = `query powerPlant {${powerPlantContent}}`
export const prosumerPowerPlantContent = "powerPlant {electricitySellPrice electricityBuyPrice}";
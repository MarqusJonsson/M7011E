import { batteryContent } from './batteryContent';
import { geoDataContent } from './geoDataContent';
import { generatorsContent } from './generatorsContent';

export const powerPlantContent = "powerPlant {electricityConsumption electricityProduction modelledElectricitySellPrice modelledElectricitySellPrice electricitySellPrice electricityBuyPrice hasBlackout " + batteryContent + geoDataContent + generatorsContent + "}";
export const powerPlantQuery = `query powerPlant {${powerPlantContent}}`
export const prosumerPowerPlantContent = "powerPlant {electricitySellPrice electricityBuyPrice}";
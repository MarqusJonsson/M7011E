import { batteryContent } from './batteryContent';
import { generatorsContent } from './generatorsContent';
import { geoDataContent } from './geoDataContent';
import { prosumerPowerPlantContent } from './powerPlantContent';

export const houseContent = "house {electricityConsumption electricityProduction overproductionRatio underproductionRatio hasBlackout " + batteryContent + geoDataContent + generatorsContent + prosumerPowerPlantContent +"}";
export const houseContentWithoutPowerPlant = "house {electricityConsumption electricityProduction overproductionRatio underproductionRatio hasBlackout " + batteryContent + geoDataContent + generatorsContent +"}";

export const houseQuery = `query house {${houseContent}}`
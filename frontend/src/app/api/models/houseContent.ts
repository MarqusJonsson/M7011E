import { batteryContent } from './batteryContent';
import { generatorsContent } from './generatorsContent';
import { geoDataContent } from './geoDataContent';
import { prosumerPowerPlantContent } from './powerPlantContent';

export const houseContent = "house {electricityConsumption electricityProduction batteryToPowerPlantRatio hasBlackout " + batteryContent + geoDataContent + generatorsContent + prosumerPowerPlantContent +"}";
export const houseQuery = `query house {${houseContent}}`
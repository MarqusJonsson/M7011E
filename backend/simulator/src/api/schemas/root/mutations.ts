import { GraphQLObjectType } from 'graphql';
import { setOverproductionBatteryToPowerPlantRatio } from '../house/mutations';
import { updateElectricityPrices } from '../powerPlant/mutations';
import { setProsumerSellTimeout } from '../prosumer/mutations';

const rootMutation = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		setOverproductionBatteryToPowerPlantRatio: setOverproductionBatteryToPowerPlantRatio,
		setUnderproductionBatteryToPowerPlantRatio: setOverproductionBatteryToPowerPlantRatio,
		updateElectricityPrices: updateElectricityPrices,
		setProsumerSellTimeout: setProsumerSellTimeout
	}
});

export { rootMutation };

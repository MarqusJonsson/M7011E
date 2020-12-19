import { GraphQLObjectType } from 'graphql';
import { updateHouseBatteryToPowerPlantRatio } from '../house/mutations';
import { updateElectricityPrices } from '../powerPlant/mutations';
import { setProsumerSellTimeout } from '../prosumer/mutations';

const rootMutation = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		updateHouseBatteryToPowerPlantRatio: updateHouseBatteryToPowerPlantRatio,
		updateElectricityPrices: updateElectricityPrices,
		setProsumerSellTimeout: setProsumerSellTimeout
	}
});

export { rootMutation };

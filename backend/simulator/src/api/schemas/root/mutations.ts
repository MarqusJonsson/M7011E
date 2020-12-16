import { GraphQLObjectType } from 'graphql';
import { updateHouseBatteryToPowerPlantRatio } from '../house/mutations';
import { updatePowerPlantElectricityPrice } from '../powerPlant/mutations';
import { setProsumerSellTimeout } from '../prosumer/mutations';

const rootMutation = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		updateHouseBatteryToPowerPlantRatio: updateHouseBatteryToPowerPlantRatio,
		updatePowerPlantElectricityPrice: updatePowerPlantElectricityPrice,
		setProsumerSellTimeout: setProsumerSellTimeout
	}
});

export { rootMutation };

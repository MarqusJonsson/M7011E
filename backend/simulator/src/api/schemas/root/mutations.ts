import { GraphQLObjectType } from 'graphql';
import { updateHouseBatteryToPowerPlantRatio } from '../house/mutations';
import { updatePowerPlantElectricityPrice } from '../powerPlant/mutations';

const rootMutation = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		updateHouseBatteryToPowerPlantRatio: updateHouseBatteryToPowerPlantRatio,
		updatePowerPlantElectricityPrice: updatePowerPlantElectricityPrice
	}
});

export { rootMutation };

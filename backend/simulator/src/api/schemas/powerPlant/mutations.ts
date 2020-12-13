import { typeName, PowerPlantType, UpdatePowerPlantElectricityPriceInputType } from './types';
import { powerPlantResolver } from '../../resolvers/powerPlant';
import {
	GraphQLNonNull
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';

const updatePowerPlantElectricityPrice = {
	type: PowerPlantType,
	description: `Update the price for consumers exchanging electricity with the ${typeName}`,
	args: {
		powerPlant: { type: new GraphQLNonNull(UpdatePowerPlantElectricityPriceInputType) }
	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return powerPlantResolver.updateElectricityPrice(
			context.simulator,
			context.user,
			args.powerPlant.electricitySellPrice,
			args.powerPlant.electricityBuyPrice
		);
	}
};

export {
	updatePowerPlantElectricityPrice
};

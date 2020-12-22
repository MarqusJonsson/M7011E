import { typeName, PowerPlantType} from './types';
import { powerPlantResolver } from '../../resolvers/powerPlant';
import {
	GraphQLFloat
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';

const updateElectricityPrices = {
	type: PowerPlantType,
	description: `Update the price for prosumers buying electricity from the ${typeName} and the price which the ${typeName} sells electricity.`,
	args: {
		electricityBuyPrice: { type: GraphQLFloat },
		electricitySellPrice: { type: GraphQLFloat }

	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return powerPlantResolver.updateElectricityPrices(
			context.simulator,
			context.user,
			args.electricitySellPrice,
			args.electricityBuyPrice
		);
	}
};

export {
	updateElectricityPrices
};

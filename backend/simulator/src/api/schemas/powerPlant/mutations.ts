import { typeName, PowerPlantType} from './types';
import { powerPlantResolver } from '../../resolvers/powerPlant';
import {
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLID
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';
import { resolve } from 'path';
import { powerPlant } from './queries';

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

const updateProductionOutputRatio = {
	type: PowerPlantType,
	description: `Update the ratio for the ${typeName} electricity production.`,
	args: {
		productionOutputRatio: { type: GraphQLFloat}
	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return powerPlantResolver.updateProductionOutputRatio(
			context.simulator,
			context.user,
			args.productionOutputRatio
		);
	}
}

const startProduction = {
	type: PowerPlantType,
	args: {id: { type: GraphQLID}},
	description: `Starts production for the ${typeName} after a delay.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		return powerPlantResolver.startProduction(
			context.simulator,
			context.user,
		);
	}
}

const stopProduction = {
	type: PowerPlantType,
	description: `Stops production for the ${typeName} after a delay.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		return powerPlantResolver.stopProduction(
			context.simulator,
			context.user,
		);
	}
}

export {
	updateElectricityPrices,
	updateProductionOutputRatio,
	startProduction,
	stopProduction
};

import { typeName, ProsumerType } from './types';
import {
	GraphQLFloat,
	GraphQLID,
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';
import { prosumerResolver } from '../../resolvers/prosumer';

const setProsumerSellTimeout = {
	type: ProsumerType,
	description: `Blocks the ${typeName} from selling for seconds specified by input.`,
	args: {
		id: { type: GraphQLID },
		seconds: { type: GraphQLFloat }
	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return prosumerResolver.blockSellElectricity(
			context.simulator,
			context.user,
			args.id,
			args.seconds
		);
	}
};

export {
	setProsumerSellTimeout
};

import { typeName, HouseType} from './types';
import { houseResolver } from '../../resolvers/house';
import {
	GraphQLFloat,
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';

const setOverproductionRatio = {
	type: HouseType,
	description: `setting the battery to power plant ratio of the ${typeName} during overproduction.`,
	args: {
		overproductionRatio: { type: GraphQLFloat },
	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return houseResolver.setOverproductionRatio(context.simulator, context.user, args.overproductionRatio);
	}
};

const setUnderproductionRatio = {
	type: HouseType,
	description: `setting battery buffer usage to market electricity usage ratio of the ${typeName} during underproduction.`,
	args: {
		underproductionRatio: { type: GraphQLFloat },
	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return houseResolver.setUnderproductionRatio(context.simulator, context.user, args.underproductionRatio);
	}
};

export {
	setOverproductionRatio,
	setUnderproductionRatio
};

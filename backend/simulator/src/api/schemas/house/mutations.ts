import { typeName, HouseType, setOverproductionBatteryToPowerPlantRatioInputType, setUnderproductionBatteryToPowerPlantRatioInputType } from './types';
import { houseResolver } from '../../resolvers/house';
import {
	GraphQLFloat,
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';

const setOverproductionBatteryToPowerPlantRatio = {
	type: HouseType,
	description: `setting the battery to power plant ratio of the ${typeName} during over production.`,
	args: {
		overproductionBatteryToPowerPlantRatio: { type: GraphQLFloat },
	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return houseResolver.setOverproductionBatteryToPowerPlantRatio(context.simulator, context.user, args.overproductionBatteryToPowerPlantRatio);
	}
};

const setUnderproductionBatteryToPowerPlantRatio = {
	type: HouseType,
	description: `setting the battery to power plant ratio of the ${typeName} during under production.`,
	args: {
		underproductionBatteryToPowerPlantRatio: { type: GraphQLFloat },
	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return houseResolver.setOverproductionBatteryToPowerPlantRatio(context.simulator, context.user, args.underproductionBatteryToPowerPlantRatio);
	}
};

export {
	setOverproductionBatteryToPowerPlantRatio,
	setUnderproductionBatteryToPowerPlantRatio
};

import { typeName, HouseType, UpdateHouseBatteryToPowerPlantRatioInputType } from './types';
import { houseResolver } from '../../resolvers/house';
import {
	GraphQLNonNull
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';

const updateHouseBatteryToPowerPlantRatio = {
	type: HouseType,
	description: `Update the battery to power plant ratio of the ${typeName}.`,
	args: {
		house: { type: new GraphQLNonNull(UpdateHouseBatteryToPowerPlantRatioInputType) }
	},
	resolve(parent: any, args: any, context: GraphQLContext) {
		return houseResolver.updateBatteryToPowerPlantRatio(
			args.house.batteryToPowerPlantRatio,
			context
		);
	}
};

export {
	updateHouseBatteryToPowerPlantRatio
};

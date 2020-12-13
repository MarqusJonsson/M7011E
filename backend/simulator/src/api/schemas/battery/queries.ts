import { typeName, BatteryType } from './types';
import { batteryResolver } from '../../resolvers/battery';
import { GraphQLContext } from '../graphQLContext';

const battery = {
	type: BatteryType,
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		return batteryResolver.findByUser(context.simulator, context.user);
	}
};

export {
	battery
};

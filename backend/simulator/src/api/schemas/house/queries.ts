import { typeName, HouseType } from './types';
import { houseResolver } from '../../resolvers/house';
import { GraphQLContext } from '../graphQLContext';

const house = {
	type: HouseType,
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		return houseResolver.findByUser(context.simulator, context.user);
	}
};

export {
	house
};

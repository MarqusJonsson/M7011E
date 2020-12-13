import { typeName, ManagerType } from './types';
import { GraphQLContext } from '../graphQLContext';
import { managerResolver } from '../../resolvers/manager';

const manager = {
	type: ManagerType,
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		return managerResolver.findByUser(context.simulator, context.user);
	}
};

export {
	manager
};

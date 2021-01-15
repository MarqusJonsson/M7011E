import { typeName, ProsumerType } from './types';
import { GraphQLContext } from '../graphQLContext';
import { prosumerResolver } from '../../resolvers/prosumer';
import { GraphQLErrorName } from '../graphQLErrors';
import { Prosumer } from '../../../users/prosumer';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { Manager } from '../../../users/manager';
import { Identifier } from '../../../identifiable';
import { GraphQLID } from 'graphql';

const prosumer = {
	type: ProsumerType,
	args: { id: { type: GraphQLID }},
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		switch (context.user.type) {
			case Prosumer.name:
				return prosumerResolver.findByUser(context.simulator, context.user, true);
			case Manager.name:
				if (args === undefined) {
					return prosumerResolver.findByUser(context.simulator, new Identifier(Prosumer.name, parent.id));
				}
				return prosumerResolver.findByUser(context.simulator, new Identifier(Prosumer.name, args.id));
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}
};

export {
	prosumer
};

import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLFloat,
	GraphQLError
} from 'graphql';
import { Identifier } from '../../../identifiable';
import { Manager } from '../../../users/manager';
import { Prosumer } from '../../../users/prosumer';
import { houseResolver } from '../../resolvers/house';
import { GraphQLContext } from '../graphQLContext';
import { GraphQLErrorName } from '../graphQLErrors';
import { HouseType } from '../house/types';

const typeName = 'Prosumer';

const ProsumerType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		currency: {
			type: GraphQLFloat,
			description: `The amount of currency the ${typeName} has.`
		},
		house: {
			type: HouseType,
			description: `The house owned by the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				switch (context.user.type) {
					case Prosumer.name:
						return houseResolver.findByUser(context.simulator, context.user);
					case Manager.name:
						return houseResolver.findByUser(context.simulator, new Identifier(Prosumer.name, parent.id));
					default:
						throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
				}
			}
		}
	}
});

export {
	typeName,
	ProsumerType
};

import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLFloat,
	GraphQLList
} from 'graphql';
import { powerPlantResolver } from '../../resolvers/powerPlant';
import { prosumerResolver } from '../../resolvers/prosumer';
import { GraphQLContext } from '../graphQLContext';
import { PowerPlantType } from '../powerPlant/types';
import { ProsumerType } from '../prosumer/types';

const typeName = 'Manager';

const ManagerType = new GraphQLObjectType({
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
		powerPlant: {
			type: PowerPlantType,
			description: `The power plant owned by the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				return powerPlantResolver.findByUser(context.simulator, context.user);
			}
		},
		prosumers: {
			type: new GraphQLList(ProsumerType),
			description: `All prosumers connected to the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				return prosumerResolver.allConnectedToManager(context.simulator, context.user);
			}
		}
	}
});

export {
	typeName,
	ManagerType
};

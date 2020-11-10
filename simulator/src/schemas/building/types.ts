import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLID,
	GraphQLFloat
} from 'graphql';
import { historyField } from '../history/fields';
import { UserType } from '../user/types';
import { userResolver } from '../../db/resolvers/user';
import { BuildingTypeType } from '../buildingType/types';
import { buildingResolver } from '../../db/resolvers/building';

const typeName = 'Building';

const BuildingType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		battery_buffer: {
			type: GraphQLFloat,
			description: `The battery buffer of the ${typeName}.`
		},
		battery_limit: {
			type: GraphQLFloat,
			description: `The battery limit of the ${typeName}.`
		},
		building_type: {
			type: BuildingTypeType,
			description: `The buildingType of the ${typeName}.`,
			resolve(parent) {
				return buildingResolver.buildingType(parent.id);
			}
		},
		owner: {
			type: UserType,
			description: `The owner of the ${typeName}.`,
			resolve(parent) {
				return userResolver.one(parent.owner_id);
			}
		},
		history: historyField(typeName)
	}
});

const BuildingInputType = new GraphQLInputObjectType({
	name: `${typeName}Input`,
	description: `Input ${typeName} payload.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		battery_buffer: {
			type: GraphQLFloat,
			description: `The battery buffer of the ${typeName}.`
		},
		battery_limit: {
			type: GraphQLFloat,
			description: `The batter limit of the ${typeName}.`
		},
		building_types_id: {
			type: GraphQLID,
			description: `The building type id of the ${typeName}.`
		},
		owner_id: {
			type: GraphQLID,
			description: `The owner id of the ${typeName}.`
		},
		histories_id: {
			type: GraphQLID,
			description: `The history id of the ${typeName}.`
		}
	}
});

export {
	typeName,
	BuildingType,
	BuildingInputType
};

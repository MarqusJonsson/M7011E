import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLID,
	GraphQLFloat
} from 'graphql';
import { buildingResolver } from '../../db/resolvers/building';
import { userResolver } from '../../db/resolvers/user';
import { BuildingType } from '../building/types';
import { historyField } from '../history/fields';
import { UserType } from '../user/types';

const typeName = 'Transaction';

const TransactionType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		currency: {
			type: GraphQLFloat,
			description: `The amount of currency transfered in the ${typeName}.`
		},
		electricity: {
			type: GraphQLFloat,
			description: `The amount of electricity transfered in the ${typeName}.`
		},
		sender_user: {
			type: UserType,
			description: `The user of the sender of the ${typeName}.`,
			resolve(parent) {
				return userResolver.one(parent.sender_users_id);
			}
		},
		receiver_user: {
			type: UserType,
			description: `The user of the receiver of the ${typeName}.`,
			resolve(parent) {
				return userResolver.one(parent.receiver_users_id);
			}
		},
		sender_building: {
			type: BuildingType,
			description: `The building of the sender of the ${typeName}.`,
			resolve(parent) {
				return buildingResolver.one(parent.sender_buildings_id);
			}
		},
		receiver_building: {
			type: BuildingType,
			description: `The building of the receiver of the ${typeName}.`,
			resolve(parent) {
				return buildingResolver.one(parent.receiver_buildings_id);
			}
		},
		history: historyField(typeName)
	}
});

const TransactionInputType = new GraphQLInputObjectType({
	name: `${typeName}Input`,
	description: `Input ${typeName} payload.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		currency: {
			type: GraphQLFloat,
			description: `The amount of currency transfered in the ${typeName}.`
		},
		electricity: {
			type: GraphQLFloat,
			description: `The amount of electricity transfered in the ${typeName}.`
		},
		sender_users_id: {
			type: GraphQLID,
			description: `The users_id of the sender of the ${typeName}.`
		},
		receiver_users_id: {
			type: GraphQLID,
			description: `The users_id of the receiver of the ${typeName}.`
		},
		sender_buildings_id: {
			type: GraphQLID,
			description: `The buildings_id of the sender of the ${typeName}.`
		},
		receiver_buildings_id: {
			type: GraphQLID,
			description: `The buildings_id of the receiver of the ${typeName}.`
		},
		histories_id: {
			type: GraphQLID,
			description: `The history object of the ${typeName}.`
		}
	}
});

export {
	typeName,
	TransactionType,
	TransactionInputType
};

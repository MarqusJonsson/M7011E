import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLFloat
} from 'graphql';
import { historyField } from '../history/fields';

const typeName = 'User';

const UserType = new GraphQLObjectType({
	name: typeName,
	description: `An ${typeName} object type.`,
	fields: () => {
		const { UserTypeType } = require('../userType/types');
		const { userResolver } = require('../../db/resolvers/user');
		return {
			id: {
				type: GraphQLID,
				description: `The id of the ${typeName}.`
			},
			email: {
				type: GraphQLString,
				description: `The email of the ${typeName}.`
			},
			currency: {
				type: GraphQLFloat,
				description: `The currency of the ${typeName}. When using UpdateCurrency, currency is instead the difference in currency to be updated.`
			},
			user_type: {
				type: UserTypeType,
				description: `The userType of the ${typeName}.`,
				resolve(parent) {
					return userResolver.userType(parent.id);
				}
			},
			history: historyField(typeName)
		}
	}
});

const UserInputType = new GraphQLInputObjectType({
	name: `${typeName}Input`,
	description: `Input ${typeName} payload.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		email: {
			type: GraphQLString,
			description: `The email of the ${typeName}.`
		},
		currency: {
			type: GraphQLFloat,
			description: `The currency of the ${typeName}. When using UpdateCurrency, currency is instead the difference in currency to be updated.`
		},
		user_types_id: {
			type: GraphQLID,
			description: `The userType of the ${typeName}.`
		},
		histories_id: {
			type: GraphQLID,
			description: `The history object of the ${typeName}.`
		}
	}
});

export {
	typeName,
	UserType,
	UserInputType
};

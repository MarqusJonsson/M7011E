import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLFloat
} from 'graphql';
import { historyField } from '../history/fields';

const typeName = 'Transaction';

const TransactionType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: () => {
		const { UserType } = require('../user/types');
		const { userResolver } = require('../../db/resolvers/user');
		return {
			id: {
				type: GraphQLID,
				description: `The id of the ${typeName}.`
			},
			amount: {
				type: GraphQLFloat,
				description: `The amount of currency transfered in the ${typeName}.`
			},
			sender: {
				type: UserType,
				description: `The id of the sender of the ${typeName}.`,
				resolve(parent) {
					return userResolver.one(parent.sender_id);
				}
			},
			receiver: {
				type: UserType,
				description: `The id of the receiver of the ${typeName}.`,
				resolve(parent) {
					return userResolver.one(parent.receiver_id);
				}
			},
			history: historyField(typeName)
		}
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
		amount: {
			type: GraphQLFloat,
			description: `The amount of currency transfered in the ${typeName}.`
		},
		sender_id: {
			type: GraphQLID,
			description: `The id of the sender of the ${typeName}.`
		},
		receiver_id: {
			type: GraphQLID,
			description: `The id of the receiver of the ${typeName}.`
		},
		history_id: {
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

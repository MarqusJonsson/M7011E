import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLList,
	GraphQLString,
	GraphQLID
} from 'graphql';
import { userResolver } from '../../db/resolvers/user';
import { historyField } from '../history/fields';

const typeName = 'UserType';

const UserTypeType = new GraphQLObjectType({
	name: typeName,
	description: `An ${typeName} object type.`,
	fields: () => {
		const { UserType } = require('../user/types');
		return {
			id: {
				type: GraphQLID,
				description: `The id of the ${typeName}.`
			},
			name: {
				type: GraphQLString,
				description: `The name of the ${typeName}.`
			},
			users: {
				type: new GraphQLList(UserType),
				description: `List of users to whom the ${typeName} has been assigned.`,
				resolve(parent) {
					return userResolver.byUserTypeId(parent.id);
				}
			},
			history: historyField(typeName)
		}
	}
});

const UserTypeInputType = new GraphQLInputObjectType({
	name: `${typeName}Input`,
	description: `Input ${typeName} type payload.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		name: {
			type: GraphQLString,
			description: `The name of the ${typeName}.`
		},
		history_id: {
			type: GraphQLID,
			description: `The history object of the ${typeName}.`
		}
	}
});

export {
	typeName,
	UserTypeType,
	UserTypeInputType
};

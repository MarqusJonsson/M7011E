import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID
} from 'graphql';

const typeName = 'History';

const HistoryType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		created_at: {
			type: GraphQLString,
			description: `Timestamp of when the ${typeName} was created.`
		},
		updated_at: {
			type: GraphQLString,
			description: `Timestamp of when the ${typeName} was last updated.`,
		}
	}
});

export {
	typeName,
	HistoryType
};

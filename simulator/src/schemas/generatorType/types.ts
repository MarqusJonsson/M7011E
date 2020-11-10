import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLID
} from 'graphql';
import { historyField } from '../history/fields';

const typeName = 'GeneratorType';

const GeneratorTypeType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		name: {
			type: GraphQLString,
			description: `The name of the ${typeName}.`
		},
		history: historyField(typeName)
	}
});

const GeneratorTypeInputType = new GraphQLInputObjectType({
	name: `${typeName}Input`,
	description: `Input ${typeName} payload.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		name: {
			type: GraphQLString,
			description: `The name of the ${typeName}.`
		},
		histories_id: {
			type: GraphQLID,
			description: `The history object of the ${typeName}.`
		}
	}
});

export {
	typeName,
	GeneratorTypeType,
	GeneratorTypeInputType
}

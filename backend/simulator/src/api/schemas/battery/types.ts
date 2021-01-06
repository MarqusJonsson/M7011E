import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLFloat
} from 'graphql';

const typeName = 'Battery';

const BatteryType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		buffer: {
			type: GraphQLFloat,
			description: `The amount of electricity in the ${typeName} buffer in Ws.`
		},
		capacity: {
			type: GraphQLFloat,
			description: `The electricity capacity of the ${typeName} in Ws.`
		},
	}
});

export {
	typeName,
	BatteryType
};

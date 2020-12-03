import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLFloat
} from 'graphql';

const typeName = 'GeoData';

const GeoDataType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		longitude: {
			type: GraphQLFloat,
			description: `The geographic coordinate in degrees that specifies the east-west position of the object in the world space.`
		},
		latitude: {
			type: GraphQLFloat,
			description: `The geographic coordinate in degrees that specifies the north-south position of the object in the world space.`
		},
		altitude: {
			type: GraphQLFloat,
			description: `The geographic coordinate in degrees that specifies the depth in relation to the world of the object in the world space.`
		},
		windSpeed: {
			type: GraphQLFloat,
			description: `Wind speed in meters per second at the geographic position of the ${typeName} in the world space.`
		},
		temperature: {
			type: GraphQLFloat,
			description: `Temperature in celsius at the geographic position of the ${typeName} in the world space.`
		}
	}
});

export {
	typeName,
	GeoDataType
};

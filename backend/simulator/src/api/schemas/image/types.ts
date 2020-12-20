import {
	GraphQLObjectType
} from 'graphql';

import { GraphQLUpload } from 'graphql-upload';

const typeName = 'Picture';

const PictureType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		picture: {
			type: GraphQLUpload,
			description: `A ${typeName} file.`
		},

	}
});

export {
	typeName,
	PictureType
};

import { typeName } from './types';
import {
	GraphQLBoolean
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { pictureResolver } from '../../resolvers/picture';


const uploadProfilePicture = {
	type: GraphQLBoolean,
	description: `Uploads an ${typeName} file.`,
	args: {
		picture: {
			description: `A ${typeName} file.`,
			type: GraphQLUpload
		}
	},
	async resolve(parent: any, args: any, context: GraphQLContext): Promise<boolean> {
		const file: FileUpload = await args.picture;
		return await pictureResolver.uploadProfilePicture(context.simulator, context.user, file);
	}
};

export {
	uploadProfilePicture
};

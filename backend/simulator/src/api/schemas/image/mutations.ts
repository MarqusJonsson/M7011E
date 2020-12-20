import { typeName } from './types';
import {
	GraphQLBoolean
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { Stream } from 'stream';

const uploadImage = {
	type: GraphQLBoolean,
	description: `Uploads an ${typeName} file.`,
	args: {
		picture: {
			description: `An ${typeName} file.`,
			type: GraphQLUpload
		}
	},
	async resolve(parent: any, args: any, context: GraphQLContext) {
		new Promise<void>((resolve, reject) => {
			args.file.createReadStream()
				.pipe(createWriteStream(__dirname + `/images/${args.filename}`))
				.on("finish", () => resolve())
				.on("error", reject)
		});
	}
};

const storeUpload = (createReadStream: () => Stream, filename: string) =>
	new Promise<void>((resolve, reject) =>
		createReadStream()
			.pipe(createWriteStream(__dirname + `/images/${filename}`))
			.on("finish", () => resolve())
			.on("error", reject)
	);

export {
	uploadImage
};

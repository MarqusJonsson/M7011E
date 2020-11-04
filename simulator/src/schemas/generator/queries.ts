import { typeName, GeneratorType } from './types';
import { generatorResolver } from '../../db/resolvers/generator';
import {
	GraphQLList,
	GraphQLID,
} from 'graphql';

const generators = {
	type: new GraphQLList(GeneratorType),
	description: `Returns all ${typeName}s.`,
	resolve(parent: any, args: any) {
		return generatorResolver.all();
	}
};

const generator = {
	type: GeneratorType,
	args: { id: { type: GraphQLID } },
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any) {
		return generatorResolver.one(args.id);
	}
};

export {
	generators,
	generator
};

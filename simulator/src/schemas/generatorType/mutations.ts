import { typeName, GeneratorTypeType, GeneratorTypeInputType } from './types';
import { generatorTypeResolver } from '../../db/resolvers/generatorType';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createGeneratorType = {
	type: GeneratorTypeType,
	description: `Create a new ${typeName} given a name. Returns the created ${typeName}.`,
	args: {
		generatorType: { type: new GraphQLNonNull(GeneratorTypeInputType) }
	},
	resolve(parent: any, args: any) {
		return generatorTypeResolver.create(args.generatorType.name);
	}
};

const removeGeneratorType = {
	type: GeneratorTypeType,
	description: `Remove an existing ${typeName} with id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return generatorTypeResolver.remove(args.id);
	}
};

const updateGeneratorType = {
	type: GeneratorTypeType,
	description: `Update an existing ${typeName} with id. Returns the updated ${typeName}.`,
	args: {
		generatorType: { type: new GraphQLNonNull(GeneratorTypeInputType) },
	},
	resolve(parent: any, args: any) {
		return generatorTypeResolver.update(
			args.generatorType.id,
			args.generatorType.name
		);
	}
};

export {
	createGeneratorType,
	removeGeneratorType,
	updateGeneratorType
};

import { GeneratorType, GeneratorInputType, typeName } from './types';
import { generatorResolver } from '../../db/resolvers/generator';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createGenerator = {
	type: GeneratorType,
	description: `Create a new generator given a ${typeName} payload containing id, base_output, is_broken, generator_type_id, buildings_id and histories_id. Returns the created ${typeName}.`,
	args: {
		generator: { type: new GraphQLNonNull(GeneratorInputType) }
	},
	resolve(parent: any, args: any) {
		return generatorResolver.create(
			args.generator.base_output,
			args.generator.is_broken,
			args.generator.generator_types_id,
			args.generator.buildings_id
		);
	}
};

const removeGenerator = {
	type: GeneratorType,
	description: `Remove an existing ${typeName} with given id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return generatorResolver.remove(args.id);
	}
};

const updateGenerator = {
	type: GeneratorType,
	description: `Update an existing ${typeName} with given id. Returns the updated ${typeName}.`,
	args: {
		generator: { type: new GraphQLNonNull(GeneratorInputType) },
	},
	resolve(parent:any, args: any){
		return generatorResolver.update(
			args.generator.id,
			args.generator.base_output,
			args.generator.is_broken,
			args.generator.generator_types_id,
			args.generator.buildings_id
		);
	}
};

export {
	createGenerator,
	removeGenerator,
	updateGenerator
};

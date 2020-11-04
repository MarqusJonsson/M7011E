import { typeName, GeneratorTypeType } from './types';
import { generatorTypeResolver } from '../../db/resolvers/generatorType';
import { GraphQLID, GraphQLList } from 'graphql';

const generatorTypes = {
	type: new GraphQLList(GeneratorTypeType),
	description: `Returns all Types.`,
	resolve() {
		return generatorTypeResolver.all();
	}
};

const generatorType = {
	type: GeneratorTypeType,
	description: `Returns a ${typeName} with matching id.`,
	args: { id: { type: GraphQLID } },
	resolve(parent: any, args: any) {
		return generatorTypeResolver.one(args.id);
	}
};

export {
	generatorTypes,
	generatorType
};

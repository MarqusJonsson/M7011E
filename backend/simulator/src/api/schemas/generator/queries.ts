import { typeName, GeneratorType } from './types';
import { generatorResolver } from '../../resolvers/generator';
import {
	GraphQLList,
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';

const generators = {
	type: new GraphQLList(GeneratorType),
	description: `Returns a ${typeName} with matching id and prosumer id.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		return generatorResolver.findByUser(context.simulator, context.user);
	}
};

export {
	generators
};

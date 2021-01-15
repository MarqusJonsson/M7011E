import { typeName, GeneratorType } from './types';
import { generatorResolver } from '../../resolvers/generator';
import {
	GraphQLList,
} from 'graphql';
import { GraphQLContext } from '../graphQLContext';

const generators = {
	type: new GraphQLList(GeneratorType),
	description: `Returns a generator list belonging to a building correlated with the ID of an user.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		return generatorResolver.findByUser(context.simulator, context.user);
	}
};

export {
	generators
};

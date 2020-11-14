import { typeName, ElectricityProductionType } from './types';
import { electricityProductionResolver } from '../../resolvers/electricityProduction';
import {
	GraphQLList,
	GraphQLID,
} from 'graphql';

const electricityProductions = {
	type: new GraphQLList(ElectricityProductionType),
	description: `Returns all ${typeName}s.`,
	resolve(parent: any, args: any) {
		return electricityProductionResolver.all();
	}
};

const electricityProduction = {
	type: ElectricityProductionType,
	args: { id: { type: GraphQLID } },
	description: `Returns an ${typeName} with matching id.`,
	resolve(parent: any, args: any) {
		return electricityProductionResolver.one(args.id);
	}
};

export {
	electricityProductions,
	electricityProduction
};

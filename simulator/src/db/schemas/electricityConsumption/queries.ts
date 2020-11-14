import { typeName, ElectricityConsumptionType } from './types';
import { electricityConsumptionResolver } from '../../resolvers/electricityConsumption';
import {
	GraphQLList,
	GraphQLID,
} from 'graphql';

const electricityConsumptions = {
	type: new GraphQLList(ElectricityConsumptionType),
	description: `Returns all ${typeName}s.`,
	resolve(parent: any, args: any) {
		return electricityConsumptionResolver.all();
	}
};

const electricityConsumption = {
	type: ElectricityConsumptionType,
	args: { id: { type: GraphQLID } },
	description: `Returns an ${typeName} with matching id.`,
	resolve(parent: any, args: any) {
		return electricityConsumptionResolver.one(args.id);
	}
};

export {
	electricityConsumptions,
	electricityConsumption
};

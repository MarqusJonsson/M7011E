import { typeName, ElectricityProductionType, ElectricityProductionInputType } from './types';
import { electricityProductionResolver } from '../../db/resolvers/electricityProduction';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createElectricityProduction = {
	type: ElectricityProductionType,
	description: `Create a new ${typeName} given a ${typeName} payload. Returns the created ${typeName}.`,
	args: {
		electricityProduction: { type: new GraphQLNonNull(ElectricityProductionInputType) }
	},
	resolve(parent: any, args: any) {
		return electricityProductionResolver.create(
			args.electricityProduction.amount,
			args.electricityProduction.generators_id,
			args.electricityProduction.buildings_id
		);
	}
};

const removeElectricityProduction = {
	type: ElectricityProductionType,
	description: `Remove an existing ${typeName} with given id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return electricityProductionResolver.remove(args.id);
	}
};

export {
	createElectricityProduction,
	removeElectricityProduction
};

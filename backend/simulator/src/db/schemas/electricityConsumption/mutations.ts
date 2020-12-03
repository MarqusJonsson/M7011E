import { typeName, ElectricityConsumptionType, ElectricityConsumptionInputType } from './types';
import { electricityConsumptionResolver } from '../../resolvers/electricityConsumption';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createElectricityConsumption = {
	type: ElectricityConsumptionType,
	description: `Create a new ${typeName} given a ${typeName} payload. Returns the created ${typeName}.`,
	args: {
		electricityConsumption: { type: new GraphQLNonNull(ElectricityConsumptionInputType) }
	},
	resolve(parent: any, args: any) {
		return electricityConsumptionResolver.create(
			args.electricityConsumption.amount,
			args.electricityConsumption.buildings_id
		);
	}
};

const removeElectricityConsumption = {
	type: ElectricityConsumptionType,
	description: `Remove an existing ${typeName} with given id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return electricityConsumptionResolver.remove(args.id);
	}
};

export {
	createElectricityConsumption,
	removeElectricityConsumption
};

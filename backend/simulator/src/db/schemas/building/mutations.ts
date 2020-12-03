import { typeName, BuildingType, BuildingInputType } from './types';
import { buildingResolver } from '../../resolvers/building';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createBuilding = {
	type: BuildingType,
	description: `Create a new ${typeName} given a ${typeName} payload. Returns the created ${typeName}.`,
	args: {
		building: { type: new GraphQLNonNull(BuildingInputType) }
	},
	resolve(parent: any, args: any) {
		return buildingResolver.create(
			args.building.battery_buffer,
			args.building.battery_limit,
			args.building.building_types_id,
			args.building.owner_id
		);
	}
};

const removeBuilding = {
	type: BuildingType,
	description: `Remove an existing ${typeName} with given id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return buildingResolver.remove(args.id);
	}
};

const updateBuilding = {
	type: BuildingType,
	description: `Update an existing ${typeName} with given id. Returns the updated ${typeName}.`,
	args: {
		building: { type: new GraphQLNonNull(BuildingInputType) },
	},
	resolve(parent:any, args: any){
		return buildingResolver.update(
			args.building.id,
			args.building.battery_buffer,
			args.building.battery_limit,
			args.building.building_types_id,
			args.building.owner_id
		);
	}
};

const updateBatteryBuffer = {
	type: BuildingType,
	description: `Update the battery buffer of an existing ${typeName} with given id. Returns the updated ${typeName}.`,
	args: {
		building: { type: new GraphQLNonNull(BuildingInputType) },
	},
	resolve(parent:any, args: any){
		return buildingResolver.updateBatteryBuffer(
			args.building.id,
			args.building.battery_buffer
		);
	}
};

export {
	createBuilding,
	removeBuilding,
	updateBuilding,
	updateBatteryBuffer
};

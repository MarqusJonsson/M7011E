import { typeName, BuildingTypeType, BuildingTypeInputType } from './types';
import { buildingTypeResolver } from '../../db/resolvers/buildingType';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createBuildingType = {
	type: BuildingTypeType,
	description: `Create a new ${typeName} given a ${typeName} payload. Returns the created ${typeName}.`,
	args: {
		buildingType: { type: new GraphQLNonNull(BuildingTypeInputType) }
	},
	resolve(parent: any, args: any) {
		return buildingTypeResolver.create(args.buildingType.name);
	}
};

const removeBuildingType = {
	type: BuildingTypeType,
	description: `Remove an existing ${typeName} with given id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return buildingTypeResolver.remove(args.id);
	}
};

const updateBuildingType = {
	type: BuildingTypeType,
	description: `Update an existing ${typeName} with given id. Returns the updated ${typeName}.`,
	args: {
		buildingType: { type: new GraphQLNonNull(BuildingTypeInputType) },
	},
	resolve(parent: any, args: any) {
		return buildingTypeResolver.update(
			args.buildingType.id,
			args.buildingType.name
		);
	}
};

export {
	createBuildingType,
	removeBuildingType,
	updateBuildingType
};

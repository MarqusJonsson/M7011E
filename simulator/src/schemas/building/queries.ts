import { typeName, BuildingType } from './types';
import { buildingResolver } from '../../db/resolvers/building';
import {
	GraphQLList,
	GraphQLID,
} from 'graphql';

const buildings = {
	type: new GraphQLList(BuildingType),
	description: `Returns all ${typeName}s.`,
	resolve(parent: any, args: any) {
		return buildingResolver.all();
	}
};

const building = {
	type: BuildingType,
	args: { id: { type: GraphQLID } },
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any) {
		return buildingResolver.one(args.id);
	}
};

export {
	buildings,
	building
};

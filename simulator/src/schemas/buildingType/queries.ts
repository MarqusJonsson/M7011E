import { typeName, BuildingTypeType } from './types';
import { buildingTypeResolver } from '../../db/resolvers/buildingType';
import { GraphQLID, GraphQLList } from 'graphql';

const buildingTypes = {
	type: new GraphQLList(BuildingTypeType),
	description: `Returns all Genera.`,
	resolve() {
		return buildingTypeResolver.all();
	}
};

const buildingType = {
	type: BuildingTypeType,
	description: `Returns a ${typeName} with matching id.`,
	args: { id: { type: GraphQLID } },
	resolve(parent: any, args: any) {
		return buildingTypeResolver.one(args.id);
	}
};

export {
	buildingTypes,
	buildingType
};

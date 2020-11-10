import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLID,
	GraphQLFloat
} from 'graphql';
import { buildingResolver } from '../../db/resolvers/building';
import { BuildingType } from '../building/types';
import { historyField } from '../history/fields';

const typeName = 'ElectricityConsumption';

const ElectricityConsumptionType = new GraphQLObjectType({
	name: typeName,
	description: `An ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		amount: {
			type: GraphQLFloat,
			description: `The amount of electricity consumed in the ${typeName}.`
		},
		building: {
			type: BuildingType,
			description: `The building which consumed the electricity in the ${typeName}.`,
			resolve(parent) {
				return buildingResolver.one(parent.buildings_id);
			}
		},
		history: historyField(typeName)
	}
});

const ElectricityConsumptionInputType = new GraphQLInputObjectType({
	name: `${typeName}Input`,
	description: `Input ${typeName} payload.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		amount: {
			type: GraphQLFloat,
			description: `The amount of electricity consumed in the ${typeName}.`
		},
		buildings_id: {
			type: GraphQLID,
			description: `The id of the building which consumed the electricity in the ${typeName}.`
		},
		histories_id: {
			type: GraphQLID,
			description: `The history object of the ${typeName}.`
		}
	}
});

export {
	typeName,
	ElectricityConsumptionType,
	ElectricityConsumptionInputType
};

import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLID,
	GraphQLFloat
} from 'graphql';
import { buildingResolver } from '../../db/resolvers/building';
import { generatorResolver } from '../../db/resolvers/generator';
import { BuildingType } from '../building/types';
import { GeneratorType } from '../generator/types';
import { historyField } from '../history/fields';

const typeName = 'ElectricityProduction';

const ElectricityProductionType = new GraphQLObjectType({
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
		generator: {
			type: GeneratorType,
			description: `The generator which produced the electricity in the ${typeName}.`,
			resolve(parent) {
				return generatorResolver.one(parent.generators_id);
			}
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

const ElectricityProductionInputType = new GraphQLInputObjectType({
	name: `${typeName}Input`,
	description: `Input ${typeName} payload.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		amount: {
			type: GraphQLFloat,
			description: `The amount of electricity produced in the ${typeName}.`
		},
		generators_id: {
			type: GraphQLID,
			description: `The id of the generator which produced the electricity in the ${typeName}.`
		},
		buildings_id: {
			type: GraphQLID,
			description: `The id of the building which received the produced the electricity in the ${typeName}.`
		},
		histories_id: {
			type: GraphQLID,
			description: `The history object of the ${typeName}.`
		}
	}
});

export {
	typeName,
	ElectricityProductionType,
	ElectricityProductionInputType
};

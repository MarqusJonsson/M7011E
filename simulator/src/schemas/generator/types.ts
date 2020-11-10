import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLID,
	GraphQLFloat,
	GraphQLBoolean
} from 'graphql';
import { historyField } from '../history/fields';
import { BuildingType } from '../building/types';
import { buildingResolver } from '../../db/resolvers/building';

const typeName = 'Generator';

const GeneratorType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: () => {
		const { GeneratorTypeType } = require('../generatorType/types');
		const { generatorResolver } = require('../../db/resolvers/generator');
		return {
			id: {
				type: GraphQLID,
				description: `The id of the ${typeName}.`
			},
			base_output: {
				type: GraphQLFloat,
				description: `The battery buffer of the ${typeName}.`
			},
			is_broken: {
				type: GraphQLBoolean,
				description: `Whether or not the ${typeName} is broken or not.`
			},
			generator_type: {
				type: GeneratorTypeType,
				description: `The generatorType of the ${typeName}.`,
				resolve(parent) {
					return generatorResolver.generatorType(parent.id);
				}
			},
			building: {
				type: BuildingType,
				description: `The building that the ${typeName} belongs to.`,
				resolve(parent) {
					return buildingResolver.one(parent.buildings_id);
				}
			},
			history: historyField(typeName)
		}
	}
});

const GeneratorInputType = new GraphQLInputObjectType({
	name: `${typeName}Input`,
	description: `Input ${typeName} payload.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		base_output: {
			type: GraphQLFloat,
			description: `The base output of the ${typeName}.`
		},
		is_broken: {
			type: GraphQLBoolean,
			description: `Whether or not the ${typeName} is broken or not.`
		},
		generator_types_id: {
			type: GraphQLID,
			description: `The generator type id of the ${typeName}.`
		},
		buildings_id: {
			type: GraphQLID,
			description: `The id of the building that the ${typeName} belongs to.`
		},
		histories_id: {
			type: GraphQLID,
			description: `The history id of the ${typeName}.`
		}
	}
});

export {
	typeName,
	GeneratorType,
	GeneratorInputType
};

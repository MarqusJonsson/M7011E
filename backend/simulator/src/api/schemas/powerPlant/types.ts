import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLFloat,
	GraphQLInputObjectType,
	GraphQLBoolean,
	GraphQLList,
	GraphQLError
} from 'graphql';
import { Manager } from '../../../users/manager';
import { Prosumer } from '../../../users/prosumer';
import { batteryResolver } from '../../resolvers/battery';
import { generatorResolver } from '../../resolvers/generator';
import { geoDataResolver } from '../../resolvers/geoData';
import { BatteryType } from '../battery/types';
import { GeneratorType } from '../generator/types';
import { GeoDataType } from '../geoData/types';
import { GraphQLContext } from '../graphQLContext';
import { GraphQLErrorName } from '../graphQLErrors';

const typeName = 'PowerPlant';

const PowerPlantType = new GraphQLObjectType({
	name: typeName,
	description: `A ${typeName} object type.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		electricityConsumption: {
			type: GraphQLFloat,
			description: `The electricity consumption of the ${typeName} in watt seconds.`
		},
		electricityProduction: {
			type: GraphQLFloat,
			description: `The electricity production of the ${typeName} in watt seconds.`
		},
		modelledElectricitySellPrice: {
			type: GraphQLFloat,
			description: `The recommended amount of currency units electricity can be sold for when selling to the ${typeName}.`,
		},
		modelledElectricityBuyPrice: {
			type: GraphQLFloat,
			description: `The recommended amount of currency units electricity can be bought for when buying from the ${typeName}`
		},
		electricitySellPrice: {
			type: GraphQLFloat,
			description: `The amount of currency units electricity can be sold for when selling to the ${typeName}.`
		},
		electricityBuyPrice: {
			type: GraphQLFloat,
			description: `The amount of currency units electricity can be bought for when buying from the ${typeName}.`
		},
		hasBlackout: {
			type: GraphQLBoolean,
			description: `Whether or not the ${typeName} is currently experiencing a blackout.`
		},
		battery: {
			type: BatteryType,
			description: `The battery of the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				if (context.user.type !== Manager.name) throw new GraphQLError("Permission denied, must be manager to fetch battery of powerPlant");
				return batteryResolver.findByUser(context.simulator, context.user);
			}
		},
		geoData: {
			type: GeoDataType,
			description: `The geo data of the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				if (context.user.type !== Manager.name) throw new GraphQLError("Permission denied, must be manager to fetch geoData of powerPlant");
				return geoDataResolver.findByUser(context.simulator, context.user);
			}
		},
		generators: {
			type: new GraphQLList(GeneratorType),
			description: `List of generators in the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				if (context.user.type !== Manager.name) throw new GraphQLError("Permission denied, must be manager to fetch generators of powerPlant");
				return generatorResolver.findByUser(context.simulator, context.user);
			}
		}
	}
});

const UpdatePowerPlantElectricityPriceInputType = new GraphQLInputObjectType({
	name: `Update${typeName}ElectricityPriceInput`,
	description: `Input payload for updating the price for consumers exchanging `
		+ `electricity with the ${typeName}.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		electricitySellPrice: {
			type: GraphQLFloat,
			description: `The amount of currency units electricity can be sold for when selling to the ${typeName}.`
		},
		electricityBuyPrice: {
			type: GraphQLFloat,
			description: `The amount of currency units electricity can be bought for when buying from the ${typeName}.`
		}
	}
});

export {
	typeName,
	PowerPlantType,
	UpdatePowerPlantElectricityPriceInputType
};

import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLFloat,
	GraphQLInputObjectType,
	GraphQLBoolean,
	GraphQLList,
	GraphQLError
} from 'graphql';
import { Prosumer } from '../../../users/prosumer';
import { batteryResolver } from '../../resolvers/battery';
import { generatorResolver } from '../../resolvers/generator';
import { geoDataResolver } from '../../resolvers/geoData';
import { powerPlantResolver } from '../../resolvers/powerPlant';
import { BatteryType } from '../battery/types';
import { GeneratorType } from '../generator/types';
import { GeoDataType } from '../geoData/types';
import { GraphQLContext } from '../graphQLContext';
import { GraphQLErrorName } from '../graphQLErrors';
import { PowerPlantType } from '../powerPlant/types';

const typeName = 'House';

const HouseType = new GraphQLObjectType({
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
		batteryToPowerPlantRatio: {
			type: GraphQLFloat,
			description: `The ratio describing how big of an portion of the produced `
			+ `electricity should be sent to the battery of the ${typeName}, the remaining `
			+ `portion gets sold to the power plant. The ratio is in a sacle from 0 to 1.`
		},
		hasBlackout: {
			type: GraphQLBoolean,
			description: `Whether or not the ${typeName} is currently experiencing a blackout.`
		},
		battery: {
			type: BatteryType,
			description: `The battery of the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				if (context.user.type !== Prosumer.name) throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
				return batteryResolver.one(context);
			}
		},
		geoData: {
			type: GeoDataType,
			description: `The geo data of correlated with the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				if (context.user.type !== Prosumer.name) throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
				return geoDataResolver.one(context);
			}
		},
		generators: {
			type: new GraphQLList(GeneratorType),
			description: `List of the generators in the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				if (context.user.type !== Prosumer.name) throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
				return generatorResolver.all(context);
			}
		}
	}
});

const UpdateHouseBatteryToPowerPlantRatioInputType = new GraphQLInputObjectType({
	name: `Update${typeName}BatteryToPowerPlantRatioInput`,
	description: `Input payload for updating the battery to power plant ratio for a ${typeName}.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		batteryToPowerPlantRatio: {
			type: GraphQLFloat,
			description: `The ratio describing how big of an portion of the produced `
			+ `electricity should be sent to the battery of the ${typeName}, the remaining `
			+ `portion gets sold to the power plant. The ratio is in a sacle from 0 to 1.`
		}
	}
});

export {
	typeName,
	HouseType,
	UpdateHouseBatteryToPowerPlantRatioInputType
};

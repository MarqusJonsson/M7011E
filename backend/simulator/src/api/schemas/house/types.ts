import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLFloat,
	GraphQLInputObjectType,
	GraphQLBoolean,
	GraphQLList,
	GraphQLError
} from 'graphql';
import { Identifier } from '../../../identifiable';
import { Manager } from '../../../users/manager';
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
		overproductionRatio: {
			type: GraphQLFloat,
			description: `The ratio describing how big of an portion of the produced `
				+ `electricity should be sent to the battery of the ${typeName}, the remaining `
				+ `portion gets sold to the power plant during overproduction. The ratio is in a scale from 0 to 1.`
		},

		underproductionRatio: {
			type: GraphQLFloat,
			description: `The ratio describing how big of an portion of the produced `
				+ `electricity should be taken from the battery of the ${typeName}, versus `
				+ `how much should be bought from the power plant during underproduction. The ratio is in a scale from 0 to 1.`
		},
		hasBlackout: {
			type: GraphQLBoolean,
			description: `Whether or not the ${typeName} is currently experiencing a blackout.`
		},
		battery: {
			type: BatteryType,
			description: `The battery of the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				switch (context.user.type) {
					case Prosumer.name:
						return batteryResolver.findByUser(context.simulator, context.user);
					case Manager.name:
						return batteryResolver.findByHouse(context.simulator, new Identifier(Prosumer.name, parent.id));
					default:
						throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
				}
			}
		},
		geoData: {
			type: GeoDataType,
			description: `The geo data of correlated with the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				switch (context.user.type) {
					case Prosumer.name:
						return geoDataResolver.findByUser(context.simulator, context.user);
					case Manager.name:
						return geoDataResolver.findByHouse(context.simulator, new Identifier(Prosumer.name, parent.id));
					default:
						throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
				}
			}
		},
		generators: {
			type: new GraphQLList(GeneratorType),
			description: `List of the generators in the ${typeName}.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				switch (context.user.type) {
					case Prosumer.name:
						return generatorResolver.findByUser(context.simulator, context.user);
					case Manager.name:
						return generatorResolver.findByHouse(context.simulator, new Identifier(Prosumer.name, parent.id));
					default:
						throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
				}
			}
		},
		powerPlant: {
			type: PowerPlantType,
			description: `The Power plant consumer exchange electricity with.`,
			resolve(parent: any, args: any, context: GraphQLContext) {
				switch (context.user.type) {
					case Prosumer.name:
						return powerPlantResolver.findByUser(context.simulator, context.user);
					default:
						throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
				}
			}
		}
	}
});

const setOverproductionRatioInputType = new GraphQLInputObjectType({
	name: `Update${typeName}BatteryToPowerPlantRatioInput`,
	description: `Input payload for setting the battery to power plant ratio for a ${typeName} during overproduction.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		overproductionRatio: {
			type: GraphQLFloat,
			description: `The ratio describing how big of an portion of the produced `
				+ `electricity should be sent to the battery of the ${typeName}, the remaining `
				+ `portion gets sold to the power plant during overproduction. The ratio is in a scale from 0 to 1.`
		}
	}
});

const setUnderproductionRatioInputType = new GraphQLInputObjectType({
	name: `Update${typeName}BatteryToPowerPlantRatioInput`,
	description: `Input payload for setting the battery to power plant ratio for a ${typeName} during underproduction.`,
	fields: {
		id: {
			type: GraphQLID,
			description: `The id of the ${typeName}.`
		},
		underproductionRatio: {
			type: GraphQLFloat,
			description: `The ratio describing how big of an portion of the produced `
				+ `electricity should be sent to the battery of the ${typeName}, the remaining `
				+ `portion gets sold to the power plant during underproduction. The ratio is in a scale from 0 to 1.`
		}
	}
});

export {
	typeName,
	HouseType,
	setOverproductionRatioInputType,
	setUnderproductionRatioInputType
};

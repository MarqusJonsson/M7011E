import { GraphQLError } from "graphql";
import { BasePowerPlant } from "../../buildings/basePowerPlant";
import { Manager } from "../../users/manager";
import { Prosumer } from "../../users/prosumer";
import { GraphQLContext } from "../schemas/graphQLContext";
import { GraphQLErrorName } from "../schemas/graphQLErrors";

class PowerPlantResolver {
	one = (context: GraphQLContext) => {
		switch (context.user.type) {
			case Prosumer.name: {
				const prosumer: Prosumer | undefined = context.simulator.prosumers.get(context.user.id)
				if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.PROSUMER_NOT_FOUND);
				const powerPlant: any = {};
				context.simulator.managers.forEach((manager) => {
					if (manager.prosumers.iGet(prosumer) !== undefined) {
						powerPlant.id = manager.powerPlant.id
						powerPlant.electricitySellPrice = manager.powerPlant.electricitySellPrice
						powerPlant.electricityBuyPrice = manager.powerPlant.electricityBuyPrice
						return;
					}
				});
				return powerPlant;
			}
			case Manager.name: {
				const manager: Manager | undefined = context.simulator.managers.get(context.user.id)
				if (manager === undefined) throw new GraphQLError(GraphQLErrorName.MANAGER_NOT_FOUND);
				const powerPlant = manager.powerPlant;
				return {
					id: manager.powerPlant.id,
					electricityConsumption: powerPlant.electricityConsumption,
					electricityProduction: powerPlant.electricityProduction,
					modelledElectricitySellPrice: powerPlant.modelledElectricitySellPrice,
					modelledElectricityBuyPrice: powerPlant.modelledElectricityBuyPrice,
					electricitySellPrice: powerPlant.electricitySellPrice,
					electricityBuyPrice: powerPlant.electricityBuyPrice,
					hasBlackout: powerPlant.hasBlackout
				};
			}
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}

	updateElectricityPrice = (sellPrice: number, buyPrice: number, context: GraphQLContext) => {
		switch (context.user.type) {
			case Manager.name:
				const manager: Manager | undefined = context.simulator.managers.get(context.user.id)
				if (manager === undefined) throw new GraphQLError(GraphQLErrorName.MANAGER_NOT_FOUND);
				manager.setSellPrice(sellPrice);
				manager.setBuyPrice(buyPrice);
				const powerPlant = manager.powerPlant;
				return {
					id: manager.powerPlant.id,
					electricityConsumption: powerPlant.electricityConsumption,
					electricityProduction: powerPlant.electricityProduction,
					modelledElectricitySellPrice: powerPlant.modelledElectricitySellPrice,
					modelledElectricityBuyPrice: powerPlant.modelledElectricityBuyPrice,
					electricitySellPrice: powerPlant.electricitySellPrice,
					electricityBuyPrice: powerPlant.electricityBuyPrice,
					hasBlackout: powerPlant.hasBlackout
				}
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}
}

export const powerPlantResolver = new PowerPlantResolver();

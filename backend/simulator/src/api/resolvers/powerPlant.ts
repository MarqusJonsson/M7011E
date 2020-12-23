import { GraphQLError } from 'graphql';
import { BasePowerPlant } from '../../buildings/basePowerPlant';
import { Identifier } from '../../identifiable';
import { Simulator } from '../../simulator';
import { Manager } from '../../users/manager';
import { Prosumer } from '../../users/prosumer';
import { GraphQLErrorName } from '../schemas/graphQLErrors';

class PowerPlantResolver {
	findByUser = (simulator: Simulator, userIdentifier: Identifier) => {
		const user: Prosumer | Manager | undefined = simulator.users.uGet(userIdentifier);
		if (user === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		switch (user.type) {
			case Prosumer.name: {
				const powerPlant: any = {};
				simulator.managers.forEach((manager) => {
					if (manager.prosumers.iGet(<Prosumer> user) !== undefined) {
						powerPlant.id = manager.building.id
						powerPlant.electricityBuyPrice = manager.building.electricityBuyPrice
						powerPlant.electricitySellPrice = manager.building.electricitySellPrice
						return;
					}
				});
				return powerPlant;
			}
			case Manager.name: {
				const powerPlant = user.building as BasePowerPlant;
				return {
					id: user.building.id,
					electricityConsumption: powerPlant.electricityConsumption / simulator.deltaTimeS,
					electricityProduction: powerPlant.electricityProduction / simulator.deltaTimeS,
					modelledElectricitySellPrice: powerPlant.modelledElectricitySellPrice,
					modelledElectricityBuyPrice: powerPlant.modelledElectricityBuyPrice,
					electricityBuyPrice: powerPlant.electricityBuyPrice,
					electricitySellPrice: powerPlant.electricitySellPrice,
					hasBlackout: powerPlant.hasBlackout,
					totalDemand: powerPlant.totalDemand / simulator.deltaTimeS,
					productionOutputRatio: powerPlant.productionOutputRatio
				};
			}
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}

	updateElectricityPrices = (simulator: Simulator, userIdentifier: Identifier, buyPrice: number, sellPrice: number) => {
		const manager: Manager | undefined = simulator.managers.uGet(userIdentifier);
		if (manager === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		manager.setBuyPrice(buyPrice);
		manager.setSellPrice(sellPrice);
		const powerPlant = manager.building;
		return {
			id: manager.building.id,
			modelledElectricitySellPrice: powerPlant.modelledElectricitySellPrice,
			modelledElectricityBuyPrice: powerPlant.modelledElectricityBuyPrice,
			electricitySellPrice: powerPlant.electricitySellPrice,
			electricityBuyPrice: powerPlant.electricityBuyPrice,
		}
	}

	updateProductionOutputRatio = (simulator: Simulator, userIdentifier: Identifier, productionOutPutRatio: number) => {
		const manager: Manager | undefined = simulator.managers.uGet(userIdentifier);
		if (manager === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		manager.building.productionOutputRatio = productionOutPutRatio;	
		return {
			productionOutputRatio: manager.building.productionOutputRatio
		}
	}
}

export const powerPlantResolver = new PowerPlantResolver();

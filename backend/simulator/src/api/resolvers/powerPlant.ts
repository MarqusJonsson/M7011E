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
						powerPlant.electricitySellPrice = manager.building.electricitySellPrice
						powerPlant.electricityBuyPrice = manager.building.electricityBuyPrice
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
					electricitySellPrice: powerPlant.electricitySellPrice,
					electricityBuyPrice: powerPlant.electricityBuyPrice,
					hasBlackout: powerPlant.hasBlackout
				};
			}
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}

	updateElectricityPrice = (simulator: Simulator, userIdentifier: Identifier, sellPrice: number, buyPrice: number) => {
		const manager: Manager | undefined = simulator.managers.uGet(userIdentifier);
		if (manager === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		manager.setSellPrice(sellPrice);
		manager.setBuyPrice(buyPrice);
		const powerPlant = manager.building;
		return {
			id: manager.building.id,
			electricityConsumption: powerPlant.electricityConsumption / simulator.deltaTimeS,
			electricityProduction: powerPlant.electricityProduction / simulator.deltaTimeS,
			modelledElectricitySellPrice: powerPlant.modelledElectricitySellPrice,
			modelledElectricityBuyPrice: powerPlant.modelledElectricityBuyPrice,
			electricitySellPrice: powerPlant.electricitySellPrice,
			electricityBuyPrice: powerPlant.electricityBuyPrice,
			hasBlackout: powerPlant.hasBlackout
		}
	}
}

export const powerPlantResolver = new PowerPlantResolver();

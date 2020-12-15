import { GraphQLError } from 'graphql';
import { Identifier } from '../../identifiable';
import { Simulator } from '../../simulator';
import { Prosumer } from '../../users/prosumer';
import { GraphQLErrorName } from '../schemas/graphQLErrors';

class HouseResolver {
	findByUser = (simulator: Simulator, userIdentifier: Identifier) => {
		const prosumer: Prosumer | undefined = simulator.prosumers.uGet(userIdentifier);
		if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		const house = prosumer.building;
		return {
			id: house.id,
			electricityConsumption: house.electricityConsumption / simulator.deltaTimeS,
			electricityProduction: house.electricityProduction / simulator.deltaTimeS,
			batteryToPowerPlantRatio: house.batteryToPowerPlantRatio,
			hasBlackout: house.hasBlackout
		}
	}

	updateBatteryToPowerPlantRatio = (simulator: Simulator, userIdentifier: Identifier, ratio: number) => {
		if (ratio < 0 || ratio > 1) throw new GraphQLError(GraphQLErrorName.INVALID_RATIO);
		const prosumer: Prosumer | undefined = simulator.prosumers.uGet(userIdentifier);
		if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		prosumer.setBatteryToPowerPlantRatio(ratio);
		const house = prosumer.building;
		return {
			id: house.id,
			electricityConsumption: house.electricityConsumption / simulator.deltaTimeS,
			electricityProduction: house.electricityProduction / simulator.deltaTimeS,
			batteryToPowerPlantRatio: house.batteryToPowerPlantRatio,
			hasBlackout: house.hasBlackout
		}
	}
}

export const houseResolver = new HouseResolver();

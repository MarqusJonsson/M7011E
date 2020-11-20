import { GraphQLError } from "graphql";
import { Prosumer } from "../../users/prosumer";
import { GraphQLContext } from "../schemas/graphQLContext";
import { GraphQLErrorName } from "../schemas/graphQLErrors";

class HouseResolver {
	one = (context: GraphQLContext) => {
		switch (context.user.type) {
			case Prosumer.name:
				const prosumer: Prosumer | undefined = context.simulator.prosumers.uGet(context.user);
				if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.PROSUMER_NOT_FOUND);
				const house = prosumer.house;
				return {
					id: house.id,
					electricityConsumption: house.electricityConsumption,
					electricityProduction: house.electricityProduction,
					batteryToPowerPlantRatio: house.batteryToPowerPlantRatio,
					hasBlackout: house.hasBlackout
				}
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}

	updateBatteryToPowerPlantRatio = (ratio: number, context: GraphQLContext) => {
		if (ratio < 0 || ratio > 1) throw new GraphQLError(GraphQLErrorName.INVALID_RATIO);
		switch (context.user.type) {
			case Prosumer.name:
				const prosumer: Prosumer | undefined = context.simulator.prosumers.uGet(context.user);
				if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.PROSUMER_NOT_FOUND);
				prosumer.setBatteryToPowerPlantRatio(ratio);
				const house = prosumer.house;
				return {
					id: house.id,
					electricityConsumption: house.electricityConsumption,
					electricityProduction: house.electricityProduction,
					batteryToPowerPlantRatio: house.batteryToPowerPlantRatio,
					hasBlackout: house.hasBlackout
				}
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}
}

export const houseResolver = new HouseResolver();

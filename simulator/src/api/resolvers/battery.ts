import { GraphQLError } from "graphql";
import { Manager } from "../../users/manager";
import { Prosumer } from "../../users/prosumer";
import { GraphQLContext } from "../schemas/graphQLContext";
import { GraphQLErrorName } from "../schemas/graphQLErrors";

class BatteryResolver {
	public one = (context: GraphQLContext) => {
		switch (context.user.type) {
			case Prosumer.name: {
				const prosumer: Prosumer | undefined = context.simulator.prosumers.get(context.user.id);
				if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.PROSUMER_NOT_FOUND);
				const battery = prosumer.house.battery;
				return {
					id: battery.id,
					buffer: battery.buffer,
					capacity: battery.capacity
				};
			}
			case Manager.name: {
				const manager: Manager | undefined = context.simulator.managers.get(context.user.id);
				if (manager === undefined) throw new GraphQLError(GraphQLErrorName.MANAGER_NOT_FOUND);
				const battery = manager.powerPlant.battery;
				return {
					id: battery.id,
					buffer: battery.buffer,
					capacity: battery.capacity
				};
			}
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}
}

export const batteryResolver = new BatteryResolver();

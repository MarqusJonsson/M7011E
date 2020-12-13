import { GraphQLError } from 'graphql';
import { Battery } from '../../buildings/components/battery';
import { Identifier } from '../../identifiable';
import { Simulator } from '../../simulator';
import { Manager } from '../../users/manager';
import { Prosumer } from '../../users/prosumer';
import { GraphQLErrorName } from '../schemas/graphQLErrors';

class BatteryResolver {
	public findByUser = (simulator: Simulator, userIdentifier: Identifier) => {
		const user: Prosumer | Manager | undefined = simulator.users.uGet(userIdentifier);
		if (user === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		const battery = user.building.battery;
		return {
			id: battery.id,
			buffer: battery.buffer,
			capacity: battery.capacity
		};
	}

	public findByHouse = (simulator: Simulator, houseIdentifier: Identifier) => {
		let battery: Battery | undefined;
		simulator.prosumers.forEach((prosumer) => {
			if (prosumer.building.id === houseIdentifier.id) {
				battery = prosumer.building.battery;
				return;
			}
		});
		if (battery === undefined) throw new GraphQLError(GraphQLErrorName.BATTERY_NOT_FOUND);
		return {
			id: battery.id,
			buffer: battery.buffer,
			capacity: battery.capacity
		}
	}
}

export const batteryResolver = new BatteryResolver();

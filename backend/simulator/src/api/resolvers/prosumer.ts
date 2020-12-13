import { GraphQLError } from 'graphql';
import { Identifier } from '../../identifiable';
import { Simulator } from '../../simulator';
import { Manager } from '../../users/manager';
import { Prosumer } from '../../users/prosumer';
import { GraphQLErrorName } from '../schemas/graphQLErrors';

class ProsumerResolver {
	findByUser = (simulator: Simulator, userIdentifier: Identifier) => {
		const prosumer: Prosumer | undefined = simulator.prosumers.uGet(userIdentifier);
		if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.PROSUMER_NOT_FOUND);
		return {
			id: prosumer.id,
			currency: prosumer.currency
		}
	}

	allConnectedToManager = (simulator: Simulator, userIdentifier: Identifier) => {
		const manager: Manager | undefined = simulator.managers.uGet(userIdentifier);
		if (manager === undefined) throw new GraphQLError(GraphQLErrorName.MANAGER_NOT_FOUND);
		const prosumers: any = [];
		manager.prosumers.forEach((prosumer) => {
			prosumers.push({
				id: prosumer.id,
				currency: prosumer.currency
			})
		});
		return prosumers;
	}
}

export const prosumerResolver = new ProsumerResolver();

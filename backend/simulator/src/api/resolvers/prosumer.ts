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
			currency: prosumer.currency,
			isBlocked: prosumer.isBlocked
		}
	}

	allConnectedToManager = (simulator: Simulator, userIdentifier: Identifier) => {
		const manager: Manager | undefined = simulator.managers.uGet(userIdentifier);
		if (manager === undefined) throw new GraphQLError(GraphQLErrorName.MANAGER_NOT_FOUND);
		const prosumers: any = [];
		manager.prosumers.forEach((prosumer) => {
			prosumers.push({
				id: prosumer.id,
				currency: prosumer.currency,
				isBlocked: prosumer.isBlocked
			})
		});
		return prosumers;
	}

	blockSellElectricity = (simulator: Simulator, userIdentifier: Identifier, id: number, seconds: number) => {
		const manager: Manager | undefined = simulator.managers.uGet(userIdentifier);
		if (manager === undefined) throw new GraphQLError(GraphQLErrorName.MANAGER_NOT_FOUND);
		const prosumer: Prosumer | undefined = manager.prosumers.uGet(new Identifier(Prosumer.name, id));
		if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.PROSUMER_NOT_FOUND);
		prosumer.blockSellElectricity(seconds);
		return {
			id: prosumer.id,
			isBlocked: prosumer.isBlocked
		}
	}
}

export const prosumerResolver = new ProsumerResolver();

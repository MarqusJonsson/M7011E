import { GraphQLError } from 'graphql';
import { Identifier } from '../../identifiable';
import { Simulator } from '../../simulator';
import { Manager } from '../../users/manager';
import { GraphQLErrorName } from '../schemas/graphQLErrors';

class ManagerResolver {
	findByUser = (simulator: Simulator, userIdentifier: Identifier) => {
		const manager: Manager | undefined = simulator.managers.uGet(userIdentifier);
		if (manager === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		return {
			id: manager.id,
			currency: manager.currency,
		}
	}
}

export const managerResolver = new ManagerResolver();

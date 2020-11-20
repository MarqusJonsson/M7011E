import { GraphQLError } from 'graphql';
import { Manager } from '../../users/manager';
import { Prosumer } from '../../users/prosumer';
import { GraphQLContext } from '../schemas/graphQLContext';
import { GraphQLErrorName } from '../schemas/graphQLErrors';

class GeoDataResolver {
	one = (context: GraphQLContext) => {
		switch (context.user.type) {
			case Prosumer.name: {
				const prosumer: Prosumer | undefined = context.simulator.prosumers.uGet(context.user);
				if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.PROSUMER_NOT_FOUND);
				const geoData = prosumer.house.geoData;
				return {
					id: geoData.id,
					longitude: geoData.longitude,
					latitude: geoData.latitude,
					altitude: geoData.altitude,
					windSpeed: geoData.windSpeed,
					temperature: geoData.temperature
				};
			}
			case Manager.name: {
				const manager: Manager | undefined = context.simulator.managers.uGet(context.user);
				if (manager === undefined) throw new GraphQLError(GraphQLErrorName.MANAGER_NOT_FOUND);
				const geoData = manager.powerPlant.geoData;
				return {
					id: geoData.id,
					longitude: geoData.longitude,
					latitude: geoData.latitude,
					altitude: geoData.altitude,
					windSpeed: geoData.windSpeed,
					temperature: geoData.temperature
				};
			}
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}
}

export const geoDataResolver = new GeoDataResolver();

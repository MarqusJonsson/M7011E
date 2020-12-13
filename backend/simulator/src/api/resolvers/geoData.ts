import { GraphQLError } from 'graphql';
import { GeoData } from '../../buildings/components/geoData';
import { Identifier } from '../../identifiable';
import { Simulator } from '../../simulator';
import { Manager } from '../../users/manager';
import { Prosumer } from '../../users/prosumer';
import { GraphQLErrorName } from '../schemas/graphQLErrors';

class GeoDataResolver {
	findByUser = (simulator: Simulator, userIdentifier: Identifier) => {
		const user: Prosumer | Manager | undefined = simulator.users.uGet(userIdentifier);
		if (user === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		const geoData =  user.building.geoData;
		return {
			id: geoData.id,
			longitude: geoData.longitude,
			latitude: geoData.latitude,
			altitude: geoData.altitude,
			windSpeed: geoData.windSpeed,
			temperature: geoData.temperature
		};
	}

	public findByHouse = (simulator: Simulator, houseIdentifier: Identifier) => {
		let geoData: GeoData | undefined;
		simulator.prosumers.forEach((prosumer) => {
			if (prosumer.building.id === houseIdentifier.id) {
				geoData = prosumer.building.geoData;
				return;
			}
		});
		if (geoData === undefined) throw new GraphQLError(GraphQLErrorName.GEO_DATA_NOT_FOUND);
		return {
			id: geoData.id,
			longitude: geoData.longitude,
			latitude: geoData.latitude,
			altitude: geoData.altitude,
			windSpeed: geoData.windSpeed,
			temperature: geoData.temperature
		}
	}
}

export const geoDataResolver = new GeoDataResolver();

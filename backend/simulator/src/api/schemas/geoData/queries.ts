import { typeName, GeoDataType } from './types';
import { geoDataResolver } from '../../resolvers/geoData';
import { GraphQLContext } from '../graphQLContext';

const geoData = {
	type: GeoDataType,
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		return geoDataResolver.findByUser(context.simulator, context.user);
	}
};

export {
	geoData
};

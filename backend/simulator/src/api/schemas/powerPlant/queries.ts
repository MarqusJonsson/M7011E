import { typeName, PowerPlantType } from './types';
import { powerPlantResolver } from '../../resolvers/powerPlant';
import { GraphQLContext } from '../graphQLContext';

const powerPlant = {
	type: PowerPlantType,
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any, context: GraphQLContext) {
		let ret = powerPlantResolver.one(context);
		return ret
	}
};

export {
	powerPlant
};

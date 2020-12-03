import { GraphQLObjectType } from 'graphql';
import { geoData } from '../geoData/queries';
import { house } from '../house/queries';
import { battery } from '../battery/queries';
import { powerPlant } from '../powerPlant/queries';
import { generators } from '../generator/queries';

const rootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		house: house,
		powerPlant: powerPlant,
		battery: battery,
		geoData: geoData,
		generators: generators
	}
});

export { rootQuery };

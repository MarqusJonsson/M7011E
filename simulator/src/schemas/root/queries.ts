import { GraphQLObjectType } from 'graphql';
import { histories, history } from '../history/queries';
import { userTypes, userType } from '../userType/queries';
import { users, user } from '../user/queries';
import { buildings, building } from '../building/queries';
import { buildingType, buildingTypes } from '../buildingType/queries';
import { generators, generator } from '../generator/queries';
import { generatorType, generatorTypes } from '../generatorType/queries';
import { transactions, transaction } from '../transaction/queries';

const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		histories: histories,
		history: history,
		userTypes: userTypes,
		userType: userType,
		users: users,
		user: user,
		buildingTypes: buildingTypes,
		buildingType: buildingType,
		buildings: buildings,
		building: building,
		generatorTypes: generatorTypes,
		generatorType: generatorType,
		generators: generators,
		generator: generator,
		transactions: transactions,
		transaction: transaction
	}
});

export { RootQuery };

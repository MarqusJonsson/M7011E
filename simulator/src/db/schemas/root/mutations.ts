import { GraphQLObjectType } from 'graphql';
import { createHistory, removeHistory, updateHistory } from '../history/mutations';
import { createUserType, removeUserType, updateUserType } from '../userType/mutations';
import { createUser, removeUser, updateUser, updateUserCurrency } from '../user/mutations';
import { createBuilding, updateBuilding, removeBuilding, updateBatteryBuffer } from '../building/mutations';
import { createBuildingType, removeBuildingType, updateBuildingType } from '../buildingType/mutations';
import { createGenerator, updateGenerator, removeGenerator } from '../generator/mutations';
import { createGeneratorType, removeGeneratorType, updateGeneratorType } from '../generatorType/mutations';
import { createTransaction, removeTransaction } from '../transaction/mutations';
import { createElectricityConsumption, removeElectricityConsumption } from '../electricityConsumption/mutations';
import { createElectricityProduction, removeElectricityProduction } from '../electricityProduction/mutations';

const RootMutation = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		createHistory: createHistory,
		removeHistory: removeHistory,
		updateHistory: updateHistory,
		createUserType: createUserType,
		removeUserType: removeUserType,
		updateUserType: updateUserType,
		createUser: createUser,
		removeUser: removeUser,
		updateUser: updateUser,
		updateUserCurrency: updateUserCurrency,
		createBuildingType: createBuildingType,
		removeBuildingType: removeBuildingType,
		updateBuildingType: updateBuildingType,
		createBuilding: createBuilding,
		removeBuilding: removeBuilding,
		updateBuilding: updateBuilding,
		updateBuildingBatteryBuffer: updateBatteryBuffer,
		createGeneratorType: createGeneratorType,
		removeGeneratorType: removeGeneratorType,
		updateGeneratorType: updateGeneratorType,
		createGenerator: createGenerator,
		removeGenerator: removeGenerator,
		updateGenerator: updateGenerator,
		createTransaction: createTransaction,
		removeTransaction: removeTransaction,
		createElectricityConsumption: createElectricityConsumption,
		removeElectricityConsumption: removeElectricityConsumption,
		createElectricityProduction: createElectricityProduction,
		removeElectricityProduction: removeElectricityProduction
	}
});

export { RootMutation };

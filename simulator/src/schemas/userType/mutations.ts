import { typeName, UserTypeType, UserTypeInputType } from './types';
import { userTypeResolver } from '../../db/resolvers/userType';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createUserType = {
	type: UserTypeType,
	description: `Create a new ${typeName} given a ${typeName} payload. Returns the created ${typeName}.`,
	args: {
		userType: { type: new GraphQLNonNull(UserTypeInputType) }
	},
	resolve(parent: any, args: any) {
		return userTypeResolver.create(args.userType.name);
	}
};

const removeUserType = {
	type: UserTypeType,
	description: `Remove an existing ${typeName} with id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return userTypeResolver.remove(args.id);
	}
};

const updateUserType = {
	type: UserTypeType,
	description: `Update an existing ${typeName} with id. Returns the updated ${typeName}.`,
	args: {
		userType: { type: new GraphQLNonNull(UserTypeInputType) },
	},
	resolve(parent: any, args: any) {
		return userTypeResolver.update(
			args.userType.id,
			args.userType.name
		);
	}
};

export {
	createUserType,
	removeUserType,
	updateUserType
};

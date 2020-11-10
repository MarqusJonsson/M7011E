import { typeName, UserType, UserInputType } from './types';
import { userResolver } from '../../db/resolvers/user';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createUser = {
	type: UserType,
	description: `Create a new ${typeName} given a ${typeName} payload. Returns the created ${typeName}.`,
	args: {
		user: { type: new GraphQLNonNull(UserInputType) }
	},
	resolve(parent: any, args: any) {
		return userResolver.create(
			args.user.email,
			args.user.currency,
			args.user.user_types_id);
	}
};

const removeUser = {
	type: UserType,
	description: `Remove an existing ${typeName} with given id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return userResolver.remove(args.id);
	}
};

const updateUser = {
	type: UserType,
	description: `Update an existing ${typeName} with given id. Returns the updated ${typeName}.`,
	args: {
		user: { type: new GraphQLNonNull(UserInputType) },
	},
	resolve(parent:any, args: any){
		return userResolver.update(args.user.id,
			args.user.email,
			args.user.currency,
			args.user.user_types_id
		);
	}
};

const updateUserCurrency = {
	type: UserType,
	description: `Update the currency of an existing ${typeName} with given id. Returns the updated ${typeName}.`,
	args: {
		user: { type: new GraphQLNonNull(UserInputType) },
	},
	resolve(parent:any, args: any){
		return userResolver.updateCurrency(
			args.user.id,
			args.user.currency
		);
	}
};

export {
	createUser,
	removeUser,
	updateUser,
	updateUserCurrency
};

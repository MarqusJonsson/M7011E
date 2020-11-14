import { typeName, UserType } from './types';
import { userResolver } from '../../resolvers/user';
import {
	GraphQLList,
	GraphQLID,
} from 'graphql';

const users = {
	type: new GraphQLList(UserType),
	description: `Returns all ${typeName}s.`,
	resolve(parent: any, args: any) {
		return userResolver.all();
	}
};

const user = {
	type: UserType,
	args: { id: { type: GraphQLID } },
	description: `Returns an ${typeName} with matching id.`,
	resolve(parent: any, args: any) {
		return userResolver.one(args.id);
	}
};

export {
	users,
	user
};

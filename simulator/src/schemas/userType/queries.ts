import { typeName, UserTypeType } from './types';
import { userTypeResolver } from '../../db/resolvers/userType';
import { GraphQLID, GraphQLList } from 'graphql';

const userTypes = {
	type: new GraphQLList(UserTypeType),
	description: `Returns all ${typeName}s.`,
	resolve() {
		return userTypeResolver.all();
	}
};

const userType = {
	type: UserTypeType,
	description: `Returns an ${typeName} with matching id.`,
	args: { id: { type: GraphQLID } },
	resolve(parent: any, args: any) {
		return userTypeResolver.one(args.id);
	}
};

export {
	userTypes,
	userType
};

import { typeName, TransactionType } from './types';
import { transactionResolver } from '../../db/resolvers/transaction';
import {
	GraphQLList,
	GraphQLID,
} from 'graphql';

const transactions = {
	type: new GraphQLList(TransactionType),
	description: `Returns all ${typeName}s.`,
	resolve(parent: any, args: any) {
		return transactionResolver.all();
	}
};

const transaction = {
	type: TransactionType,
	args: { id: { type: GraphQLID } },
	description: `Returns a ${typeName} with matching id.`,
	resolve(parent: any, args: any) {
		return transactionResolver.one(args.id);
	}
};

export {
	transactions,
	transaction
};

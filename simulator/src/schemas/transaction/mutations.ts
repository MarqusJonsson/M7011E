import { typeName, TransactionType, TransactionInputType } from './types';
import { transactionResolver } from '../../db/resolvers/transaction';
import {
	GraphQLNonNull,
	GraphQLID
} from 'graphql';

const createTransaction = {
	type: TransactionType,
	description: `Create a new ${typeName} given a ${typeName} payload. Returns the created ${typeName}.`,
	args: {
		transaction: { type: new GraphQLNonNull(TransactionInputType) }
	},
	resolve(parent: any, args: any) {
		return transactionResolver.create(
			args.transaction.currency,
			args.transaction.electricity,
			args.transaction.sender_users_id,
			args.transaction.receiver_users_id,
			args.transaction.sender_buildings_id,
			args.transaction.receiver_buildings_id
		);
	}
};

const removeTransaction = {
	type: TransactionType,
	description: `Remove an existing ${typeName} with given id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return transactionResolver.remove(args.id);
	}
};

export {
	createTransaction,
	removeTransaction
};

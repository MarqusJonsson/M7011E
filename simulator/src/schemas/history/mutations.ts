import { typeName, HistoryType } from './types';
import { historyResolver } from '../../db/resolvers/history';
import { GraphQLNonNull, GraphQLID } from 'graphql';

const createHistory = {
	type: HistoryType,
	description: `Create a new ${typeName} given a ${typeName} payload. Returns the created ${typeName}.`,
	resolve() {
		return historyResolver.create();
	}
};

const removeHistory = {
	type: HistoryType,
	description: `Remove an existing ${typeName} with id. Returns the removed ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return historyResolver.remove(args.id);
	}
};

const updateHistory = {
	type: HistoryType,
	description: `Update an existing ${typeName} with id. Returns the updated ${typeName}.`,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) }
	},
	resolve(parent: any, args: any) {
		return historyResolver.update(args.id);
	}
};

export {
	createHistory,
	removeHistory,
	updateHistory
};

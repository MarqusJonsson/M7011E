import { typeName, HistoryType } from './types';
import { historyResolver } from '../../resolvers/history';
import { GraphQLID, GraphQLList } from 'graphql';

const histories = {
	type: new GraphQLList(HistoryType),
	description: `Returns all histories.`,
	resolve() {
		return historyResolver.all();
	}
};

const history = {
	type: HistoryType,
	description: `Returns a ${typeName} with matching id.`,
	args: { id: { type: GraphQLID } },
	resolve(parent: any, args: any) {
		return historyResolver.one(args.id);
	}
};

export {
	histories,
	history
};

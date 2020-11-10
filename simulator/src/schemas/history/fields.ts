import { typeName, HistoryType } from './types';
import { historyResolver } from '../../db/resolvers/history';

const historyField = (name: string) => {
	return {
		type: HistoryType,
		description: `The ${typeName} of the ${name}.`,
		resolve(parent: any) {
			return historyResolver.one(parent.histories_id);
		}
	}
};

export {
	historyField
};

import { db } from '../connection';
import { BaseResolver } from './base';
import { historyResolver } from './history';
import { ITask } from 'pg-promise';

class BaseWithHistoryResolver extends BaseResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.remove = `
			DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
	}

	remove = async (id: number | string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const role = await t.one(this.queries.remove, id);
			await t.oneOrNone(historyResolver.queries.remove, role.histories_id);
			return role;
		}).catch(error => console.error(error));
	}
}

export { BaseWithHistoryResolver };

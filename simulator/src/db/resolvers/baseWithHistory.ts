import { db } from '../connection';
import { BaseResolver } from './base';
import { historyResolver } from './history';

class BaseWithHistoryResolver extends BaseResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.remove = `
			DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
	}

	remove = async (id: number | string) => {
		return await db.tx(async t => {
			const role = await t.one(this.queries.remove, id);
			await t.oneOrNone(historyResolver.queries.remove, role.history_id);
			return role;
		}).catch(err => console.log(err));
	}
}

export { BaseWithHistoryResolver };

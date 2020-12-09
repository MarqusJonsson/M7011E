import { db } from '../connection';
import { historyResolver } from './history';
import { BaseWithHistoryResolver } from './baseWithHistory';
import { ITask } from 'pg-promise';

abstract class TypeResolver extends BaseWithHistoryResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(name, histories_id) VALUES ($1, $2) RETURNING *`;
		this.queries.update = `
			UPDATE ${this.tableName} SET name = $2 WHERE id = $1 RETURNING *`;
	}

	create = async (name: string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const history = await t.one(historyResolver.queries.create);
			return await t.oneOrNone(this.queries.create, [name, history.id]);
		}).catch(error => console.error(error));
	}

	update = async (id: number | string, name: string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const type = await t.one(this.queries.update, [id, name]);
			await t.oneOrNone(historyResolver.queries.update, [type.histories_id]);
			return type;
		}).catch(error => console.error(error));
	}
}

export { TypeResolver };

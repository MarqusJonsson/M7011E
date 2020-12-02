import { db } from '../connection';
import { BaseResolver } from './base';

class HistoryResolver extends BaseResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(created_at, updated_at)
			VALUES (NOW(), NOW()) RETURNING *`;
		this.queries.update = `
			UPDATE ${this.tableName} SET updated_at = NOW() WHERE id = $1
			RETURNING *`;
	}

	create = async (): Promise<any> => {
		return db
			.oneOrNone(this.queries.create)
			.catch(err => console.log(err));
	}

	update = async (id: number | string): Promise<any> => {
		const values = [id];
		return db
			.oneOrNone(this.queries.update, values)
			.catch(err => console.log(err));
	}
}

export const historyResolver = new HistoryResolver('histories');

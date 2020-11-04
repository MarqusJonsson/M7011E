import { db } from '../connection';
import { historyResolver } from './history';
import { BaseWithHistoryResolver } from './baseWithHistory';
import { ITask } from 'pg-promise';

class TransactionResolver extends BaseWithHistoryResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(amount, sender_id, receiver_id, history_id)
			VALUES ($1, $2, $3, $4) RETURNING *`;
		this.queries.update = `
			UPDATE ${this.tableName} SET amount = $2, sender_id = $3, receiver_id = $4
			WHERE id = $1 RETURNING *`;
	}

	create = async (amount: number, sender_id: number | string, receiver_id: number | string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const history = await t.one(historyResolver.queries.create);
			return await t.oneOrNone(this.queries.create, [amount, sender_id, receiver_id, history.id]);
		}).catch(err => console.log(err));
	}

	update = async (id: number | string, amount: number, sender_id: number | string, receiver_id: number | string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const user = await t.one(this.queries.update, [id, amount, sender_id, receiver_id]);
			await t.oneOrNone(historyResolver.queries.update, [user.history_id])
			return user;
		}).catch(err => console.log(err));
	}
}

export const transactionResolver = new TransactionResolver('transactions');

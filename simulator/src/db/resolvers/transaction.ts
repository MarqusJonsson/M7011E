import { db } from '../connection';
import { historyResolver } from './history';
import { BaseWithHistoryResolver } from './baseWithHistory';
import { userResolver } from './user';
import { ITask } from 'pg-promise';

class TransactionResolver extends BaseWithHistoryResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(amount, sender_id, receiver_id, history_id)
			VALUES ($1, $2, $3, $4) RETURNING *`;
	}

	create = async (amount: number, senderId: number | string, receiverId: number | string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			await t.one(userResolver.queries.updateCurrency, [senderId, -amount]);
			await t.one(userResolver.queries.updateCurrency, [receiverId, amount]);
			const history = await t.one(historyResolver.queries.create);
			return await t.one(this.queries.create, [amount, senderId, receiverId, history.id]);
		}).catch(err => console.log(err));
	}
}

export const transactionResolver = new TransactionResolver('transactions');

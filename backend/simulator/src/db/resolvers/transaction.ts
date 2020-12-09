import { db } from '../connection';
import { historyResolver } from './history';
import { BaseWithHistoryResolver } from './baseWithHistory';
import { userResolver } from './user';
import { buildingResolver } from './building';
import { ITask } from 'pg-promise';

class TransactionResolver extends BaseWithHistoryResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(currency, electricity, sender_users_id, receiver_users_id, sender_buildings_id, receiver_buildings_id, histories_id)
			VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
	}

	create = async (currency: number, electricity: number, senderUsersId: number | string, receiverUsersId: number | string, senderBuildingsId: number | string, receiverBuildingsId: number | string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			await t.one(userResolver.queries.updateCurrency, [senderUsersId, -currency]);
			await t.one(userResolver.queries.updateCurrency, [receiverUsersId, currency]);
			await t.one(buildingResolver.queries.updateBatteryBuffer, [senderBuildingsId, electricity]);
			await t.one(buildingResolver.queries.updateBatteryBuffer, [receiverBuildingsId, -electricity]);
			const history = await t.one(historyResolver.queries.create);
			return await t.one(this.queries.create, [currency, electricity, senderUsersId, receiverUsersId, senderBuildingsId, receiverBuildingsId, history.id]);
		}).catch(error => console.error(error));
	}
}

export const transactionResolver = new TransactionResolver('transactions');

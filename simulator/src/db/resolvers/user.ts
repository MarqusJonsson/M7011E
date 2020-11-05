import { db } from '../connection';
import { historyResolver } from './history';
import { BaseWithHistoryResolver } from './baseWithHistory';
import { ITask } from 'pg-promise';

class UserResolver extends BaseWithHistoryResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(email, currency, user_types_id, history_id)
			VALUES ($1, $2, $3, $4) RETURNING *`;
		this.queries.update = `
			UPDATE ${this.tableName} SET email = $2, currency = $3, user_types_id = $4
			WHERE id = $1 RETURNING *`;
		this.queries.updateCurrency = `
			UPDATE ${this.tableName} SET currency = currency + $2 WHERE id = $1 RETURNING *`;
		this.queries.byUserTypeId = `
			SELECT * FROM ${this.tableName} WHERE user_types_id = $1`;
		this.queries.userType = () => {
			const { userTypeResolver } = require('./userType');
			return `
				SELECT * FROM ${userTypeResolver.tableName} WHERE id =
				(SELECT user_types_id FROM ${this.tableName} WHERE id = $1);`;
		}
	}

	create = async (email: string, currency: number, userTypesId: number | string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const history = await t.one(historyResolver.queries.create);
			return await t.oneOrNone(this.queries.create, [email, currency, userTypesId, history.id]);
		}).catch(err => console.log(err));
	}

	update = async (id: number | string, email: string, currency: number, userTypesId: number | string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const user = await t.one(this.queries.update, [id, email, currency, userTypesId]);
			await t.oneOrNone(historyResolver.queries.update, [user.history_id])
			return user;
		}).catch(err => console.log(err));
	}

	updateCurrency = async (id: number | string, currencyDelta: number): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const user = await t.one(this.queries.updateCurrency, [id, currencyDelta]);
			await t.oneOrNone(historyResolver.queries.update, [user.history_id])
			return user;
		}).catch(err => console.log(err));
	}

	byUserTypeId = async (userTypeId: number | string): Promise<any> => {
		return db
			.manyOrNone(this.queries.byUserTypeId, [userTypeId])
			.catch(err => console.log(err));
	}

	userType = async (id: number | string): Promise<any> => {
		return db
			.oneOrNone(this.queries.userType, [id])
			.catch(err => console.log(err));
	}
}

export const userResolver = new UserResolver('users');

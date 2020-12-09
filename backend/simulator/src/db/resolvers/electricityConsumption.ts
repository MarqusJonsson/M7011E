import { db } from '../connection';
import { historyResolver } from './history';
import { BaseWithHistoryResolver } from './baseWithHistory';
import { buildingResolver } from './building';
import { ITask } from 'pg-promise';

class ElectricityConsumptionResolver extends BaseWithHistoryResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(amount, buildings_id, histories_id)
			VALUES ($1, $2, $3) RETURNING *`;
	}

	create = async (amount: number, buildingsId: number | string): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			await t.one(buildingResolver.queries.updateBatteryBuffer, [buildingsId, -amount]);
			const history = await t.one(historyResolver.queries.create);
			return await t.one(this.queries.create, [amount, buildingsId, history.id]);
		}).catch(error => console.error(error));
	}
}

export const electricityConsumptionResolver = new ElectricityConsumptionResolver('electricity_consumptions');

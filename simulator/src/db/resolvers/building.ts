import { db } from "../connect";
import { historyResolver } from "./history"; 
import { BaseWithHistoryResolver } from "./baseWithHistory";

class BuildingResolver extends BaseWithHistoryResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(battery_buffer, battery_limit, building_types_id, owner_id, history_id)
			VALUES ($1, $2, $3, $4, $5) RETURNING *`;
		this.queries.update = `
			UPDATE ${this.tableName} SET battery_buffer = $2, battery_limit = $3, building_types_id = $4, owner_id = $5
			WHERE id = $1 RETURNING *`;
		this.queries.updateBatteryBuffer = `
			UPDATE ${this.tableName} SET battery_buffer = $2 WHERE id = $1 RETURNING *`;
		this.queries.building_type = () => {
			const { buildingTypeResolver } = require('./buildingType');
			return `
				SELECT * FROM ${buildingTypeResolver.tableName} WHERE id =
				(SELECT building_types_id FROM ${this.tableName} WHERE id = $1);`;
		}
	}

	create = async(batteryBuffer: number, batteryLimit: number, building_types_id_id: number | string, owner_id: string| number) => {
		return await db.tx(async t => {
			const history = await t.one(historyResolver.queries.create);
			return await t.oneOrNone(this.queries.create, [batteryBuffer, batteryLimit, building_types_id_id, owner_id, history.id]);
		}).catch(err => console.log(err));
	}

	update = async(id: number | string, batteryBuffer: number, batteryLimit: number, building_types_id_id: number | string, owner_id: number | string) => {
		return await db.tx(async t => {
			const building = await t.one(this.queries.update, [id, batteryBuffer, batteryLimit, building_types_id_id, owner_id]);
			await t.oneOrNone(historyResolver.queries.update, [building.history_id])
			return building;
		}).catch(err => console.log(err));  
	}

	updateBatteryBuffer = async(id: number | string, batteryBuffer: number) => {
		return await db.tx(async t => {
			const building = await t.one(this.queries.updateBatteryBuffer, [id, batteryBuffer]);
			await t.oneOrNone(historyResolver.queries.update, [building.history_id])
			return building;
		}).catch(err => console.log(err));
	}

	building_type = async (id: number | string) => {
		return db
			.oneOrNone(this.queries.building_type, [id])
			.catch(err => console.log(err));
	}
}

export const buildingResolver = new BuildingResolver('buildings');

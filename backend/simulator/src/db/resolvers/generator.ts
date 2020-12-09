import { db } from '../connection';
import { historyResolver } from './history'; 
import { BaseWithHistoryResolver } from './baseWithHistory';
import { ITask } from 'pg-promise';

class GeneratorResolver extends BaseWithHistoryResolver {
	constructor(tableName: string) {
		super(tableName);
		this.queries.create = `
			INSERT INTO ${this.tableName}(base_output, is_broken, generator_types_id, buildings_id, histories_id)
			VALUES ($1, $2, $3, $4, $5) RETURNING *`;
		this.queries.update = `
			UPDATE ${this.tableName} SET base_output = $2, is_broken = $3, generator_types_id = $4, buildings_id = $5
			WHERE id = $1 RETURNING *`;
		this.queries.generatorType = () => {
			const { generatorTypeResolver } = require('./generatorType');
			return `
				SELECT * FROM ${generatorTypeResolver.tableName} WHERE id =
				(SELECT generator_types_id FROM ${this.tableName} WHERE id = $1);`;
		}
	}

	create = async(baseOutput: number, isBroken: boolean, generatorTypesId: string | number, buildingsId: string | number): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const history = await t.one(historyResolver.queries.create);
			return await t.oneOrNone(this.queries.create, [baseOutput, isBroken, generatorTypesId, buildingsId, history.id]);
		}).catch(error => console.error(error));
	}

	update = async (id: string|number, baseOutput: number, isBroken: boolean, generatorTypesId: string | number, buildingsId: string | number): Promise<any> => {
		return await db.tx(async (t: ITask<{}>) => {
			const generator = await t.one(this.queries.update, [id, baseOutput, isBroken, generatorTypesId, buildingsId]);
			await t.oneOrNone(historyResolver.queries.update, [generator.histories_id])
			return generator;
		}).catch(error => console.error(error));
	}

	generatorType = async (id: number | string): Promise<any> => {
		return db
			.oneOrNone(this.queries.generatorType, [id])
			.catch(error => console.error(error));
	}
}

export const generatorResolver = new GeneratorResolver('generators');

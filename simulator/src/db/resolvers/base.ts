import { db } from '../connect';

abstract class BaseResolver {
	private _tableName: string;
	private _queries: any;
	constructor(tableName: string) {
		this._tableName = tableName;
		this._queries = {
			one: `
				SELECT * FROM ${this.tableName} WHERE id = $1`,
			all: `
				SELECT * FROM ${this.tableName}`,
			remove: `
				DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
		};
	}

	one = async (id: number | string) => {
		return db
			.one(this.queries.one, [id])
			.catch((err: string) => console.log(err));
	}

	all = async () => {
		return db
			.manyOrNone(this.queries.all)
			.catch((err: string) => console.log(err));
	}

	remove = async (id: number | string) => {
		return db
			.one(this.queries.remove, [id])
			.catch((err: string) => console.log(err));
	}

	public get tableName(): string {
		return this._tableName;
	}

	public get queries(): any {
		return this._queries;
	}

	public set queries(queries: any) {
		this._queries = queries;
	}
}

export { BaseResolver };

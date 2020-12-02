import pgPromise from 'pg-promise';
import { toResponseError } from '../errorParser';

export abstract class BaseRepository<T> {
	protected database: pgPromise.IDatabase<any>;
	protected readonly tableName: string;

	constructor(database: pgPromise.IDatabase<any>, tableName: string) {
		this.database = database;
		this.tableName = tableName;
	}

	public abstract createTable(): Promise<null>

	public delete(id: number, t?: pgPromise.ITask<any>): Promise<number> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.one(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, id).then((deletedRecord) => {
				resolve(deletedRecord.id);
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}

	public all(t?: pgPromise.ITask<any>): Promise<T[]> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.manyOrNone(`SELECT * FROM ${this.tableName}`).then((records: T[]) => {
				resolve(records);
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}

	public find(id: number, t?: pgPromise.ITask<any>): Promise<T> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.one(`SELECT * FROM ${this.tableName} WHERE id = $1`, id).then((record: T) => {
				resolve(record);
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}

	public total(t?: pgPromise.ITask<any>): Promise<number> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.one(`SELECT count(*) FROM ${this.tableName}`).then((nRecords: number) => {
				resolve(nRecords);
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}

	public empty(t?: pgPromise.ITask<any>): Promise<null> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.none(`TRUNCATE TABLE ${this.tableName} CASCADE`).then(() => {
				resolve(null);
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}
}

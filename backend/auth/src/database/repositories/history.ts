import pgPromise from 'pg-promise';
import { toResponseError } from '../errorParser';
import { History } from '../models/history';
import { BaseRepository } from './base';

const tableName = 'histories';
export class HistoryRepository extends BaseRepository<History> {
	constructor(database: pgPromise.IDatabase<any>) {
		super(database, tableName);
	}

	public createTable(t?: pgPromise.ITask<any>): Promise<null> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.none(`
				CREATE TABLE IF NOT EXISTS ${this.tableName}(
					id SERIAL PRIMARY KEY,
					created_at TIMESTAMP NOT NULL,
					updated_at TIMESTAMP NOT NULL
				)`
			).then(() => {
				resolve(null);
			}).catch((error) => {
				reject(new Error(`Failed to create database table \'${this.tableName}\': ${error.message}`));
			});
		});
	}

	public insert(t?: pgPromise.ITask<any>): Promise<number> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.one(`INSERT INTO ${this.tableName}(created_at, updated_at) VALUES (NOW(), NOW()) RETURNING id`).then((insertedHistory) => {
				resolve(insertedHistory.id);
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}

	public update(id: number, t?: pgPromise.ITask<any>): Promise<number> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.one(`UPDATE ${this.tableName} SET updated_at = NOW() WHERE id = $1 RETURNING id`, id).then((updatedHistory) => {
				resolve(updatedHistory.id);
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}
}

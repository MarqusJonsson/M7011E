import pgPromise from 'pg-promise';
import { toResponseError } from '../errorParser';
import { RefreshToken } from '../models/refreshToken';
import { BaseWithHistoryRepository } from './baseWithHistory';
import { HistoryRepository } from './history';

const tableName = 'refresh_tokens';

export class RefreshTokenRepository extends BaseWithHistoryRepository<RefreshToken> {
	constructor(database: pgPromise.IDatabase<any>, historyRepository: HistoryRepository) {
		super(database, tableName, historyRepository);
	}

	public createTable(t?: pgPromise.ITask<any>): Promise<null> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.none(`
				CREATE TABLE IF NOT EXISTS ${this.tableName}(
					id INT PRIMARY KEY,
					token CHAR (60)	NOT NULL UNIQUE,
					users_id INT NOT NULL REFERENCES users (id),
					histories_id INT NOT NULL REFERENCES histories (id)
				)`
			).then(() => {
				resolve(null);
			}).catch((error) => {
				reject(new Error(`Failed to create database table \'${this.tableName}\': ${error.message}`));
			});
		});
	}

	public insert(id: number, token: string, userId: number, t?: pgPromise.ITask<any>): Promise<number> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.txIf((t_: pgPromise.ITask<any>) => {
				return this.historyRepository.insert(t_).then((insertedHistoryId) => {
					return t_.one(`INSERT INTO ${this.tableName}(id, token, users_id, histories_Id) VALUES ($1, $2, $3, $4) RETURNING id`, [id, token, userId, insertedHistoryId]).then((insertedToken) => {
						resolve(insertedToken.id);
					}).catch((error) => { reject(toResponseError(error)); });
				}).catch((error) => { reject(toResponseError(error)); });
			});
		});
	}

	public getNextId(t?: pgPromise.ITask<any>): Promise<number> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.oneOrNone(`SELECT MAX(id) AS max FROM ${this.tableName}`).then((result) => {
				if (result.max === null) {
					resolve(1);
				} else {
					resolve(result.max + 1);
				}
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}
}

import pgPromise from 'pg-promise';
import { ResponseError } from '../../utils/error';
import { StatusCode } from '../../utils/statusCode';
import { toResponseError } from '../errorParser';
import { User } from '../models/user';
import { BaseWithHistoryRepository } from './baseWithHistory';
import { HistoryRepository } from './history';

const tableName = 'users';

export class UsersRepository extends BaseWithHistoryRepository<User> {
	public static readonly userRole = {
		PROSUMER: 0,
		MANAGER: 1
	};
	public static readonly defaultUserRole = UsersRepository.userRole.PROSUMER;

	constructor(database: pgPromise.IDatabase<any>, historyRepository: HistoryRepository) {
		super(database, tableName, historyRepository);
	}

	public createTable(t?: pgPromise.ITask<any>): Promise<null> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			db.none(`
				CREATE TABLE IF NOT EXISTS ${this.tableName}(
					id SERIAL PRIMARY KEY,
					email VARCHAR (255)	NOT NULL UNIQUE,
					password VARCHAR (60) NOT NULL,
					role SMALLINT default '${UsersRepository.defaultUserRole}',
					histories_id INT NOT NULL REFERENCES histories (id)
				)`
			).then(() => {
				resolve(null);
			}).catch((error) => {
				reject(new Error(`Failed to create database table \'${this.tableName}\': ${error.message}`));
			});
		});
	}

	public insert(email: string, password: string, t?: pgPromise.ITask<any>): Promise<number> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.txIf((t_: pgPromise.ITask<any>) => {
				return this.historyRepository.insert(t_).then((insertedHistoryId) => {
					return t_.one(`INSERT INTO ${this.tableName}(email, password, histories_Id) VALUES ($1, $2, $3) RETURNING id`, [email, password, insertedHistoryId]).then((insertedUser) => {
						resolve(insertedUser.id);
					}).catch((error) => { reject(toResponseError(error)); });
				}).catch((error) => { reject(toResponseError(error)); });
			});
		});
	}
	
	public findByEmail(email: string, t?: pgPromise.ITask<any>): Promise<User> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.taskIf((t_: pgPromise.ITask<any>) => {
				return t_.one(`SELECT id, email, histories_id FROM ${this.tableName} WHERE email = $1`, email).then((user) => {
					return this.historyRepository.find(user.histories_id, t_).then((history) => {
						user.history = history;
						resolve(user);
					}).catch((error) => { reject(toResponseError(error)); });
				}).catch((error) => { reject(toResponseError(error)); });
			});
		});
	}

	public findPasswordByEmail(email: string, t?: pgPromise.ITask<any>): Promise<User> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.one(`SELECT id, role, password FROM ${this.tableName} WHERE email = $1`, email).then((user) => {
				resolve(user);
			}).catch((error) => { reject(new ResponseError('Invalid email or password', StatusCode.UNAUTHORIZED)); });
		});
	}
	
	public updatePassword(id: number, newPassword: string, t?: pgPromise.ITask<any>): Promise<User> {
		return new Promise((resolve, reject) => {
			const db = t || this.database;
			return db.txIf((t_: pgPromise.ITask<any>) => {
				return t_.one(`UPDATE ${this.tableName} SET password = $2 WHERE id = $1 RETURNING id`, [id, newPassword]).then((updatedUser) => {
					return this.historyRepository.update(updatedUser.id, t_).then((updatedHistoryId) => {
						resolve(updatedUser);
					}).catch((error) => { reject(toResponseError(error)); });
				}).catch((error) => { reject(toResponseError(error)); });
			});
		});
	}
}

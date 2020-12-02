import { BaseRepository } from './base';
import { HistoryRepository } from './history'
import pgPromise from 'pg-promise';
import { toResponseError } from '../errorParser';
export abstract class BaseWithHistoryRepository<T> extends BaseRepository<T> {
	protected historyRepository: HistoryRepository;

	constructor(database: pgPromise.IDatabase<any>, tableName: string, historyRepository: HistoryRepository) {
		super(database, tableName);
		this.historyRepository = historyRepository;
	}

	public delete(id: number, t?: pgPromise.ITask<any>): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			const db = t || this.database;
			return db.txIf((t_: pgPromise.ITask<any>) => {
				return db.one(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id, histories_id`, id).then((deletedRecord: {id :number, histories_id: number}) => {
					return this.historyRepository.delete(deletedRecord.histories_id, t_).then((deletedHistoryId) => {
						resolve(deletedRecord.id);
					}).catch((error) => { reject(toResponseError(error)); });
				}).catch((error) => { reject(toResponseError(error)); });
			}).catch((error) => { reject(toResponseError(error)); });
		});
	}
}

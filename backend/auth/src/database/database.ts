import dotenv from 'dotenv';
import pgPromise from 'pg-promise';
import { HistoryRepository, IExtensions, RefreshTokenRepository, UsersRepository } from './repositories/index';
dotenv.config();

type ExtendedProtocol = pgPromise.IDatabase<IExtensions> & IExtensions;

const config = {
	host: <string> process.env.POSTGRES_HOST,
	port: <number> <unknown> process.env.POSTGRES_PORT,
	database: <string> process.env.POSTGRES_DB,
	user: <string> process.env.POSTGRES_USER,
	password: <string> process.env.POSTGRES_PASSWORD
}

const initOptions: pgPromise.IInitOptions<IExtensions> = {
	extend(obj: ExtendedProtocol) {
		obj.histories = new HistoryRepository(obj);
		obj.users = new UsersRepository(obj, obj.histories);
		obj.refreshTokens = new RefreshTokenRepository(obj, obj.histories);
	}
}

const pgp = pgPromise(initOptions);

export const database: ExtendedProtocol = pgp(config);

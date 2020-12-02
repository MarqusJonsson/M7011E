import dotenv from 'dotenv';
import pgPromise from 'pg-promise';
dotenv.config();

const pgp = pgPromise({});

const config = {
	host: <string> process.env.POSTGRES_HOST,
	port: <number> <unknown> process.env.POSTGRES_PORT,
	database: <string> process.env.POSTGRES_DB,
	user: <string> process.env.POSTGRES_USER,
	password: <string> process.env.POSTGRES_PASSWORD
}

export const db = pgp(config);

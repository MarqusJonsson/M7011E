import { db } from './connection';

const recreateEmptySchema = `
	DROP SCHEMA public CASCADE;
	CREATE SCHEMA public;
`;

export const clear = () => db.none(recreateEmptySchema);

import { db } from './connect';

const recreateEmptySchema = `
	DROP SCHEMA public CASCADE;
	CREATE SCHEMA public;
`;

export const clear = () => db.none(recreateEmptySchema);

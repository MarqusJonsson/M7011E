import { db } from './connection';

const createTables = `
	CREATE TABLE histories (
		id			SERIAL		PRIMARY KEY,
		created_at	TIMESTAMPTZ	NOT NULL,
		updated_at	TIMESTAMPTZ	NOT NULL
	);
	CREATE TABLE user_types (
		id				SERIAL			PRIMARY KEY,
		name			VARCHAR (255)	NOT NULL	UNIQUE,
		histories_id	INT				NOT NULL,
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);
	CREATE TABLE users (
		id				SERIAL	PRIMARY KEY,
		email			VARCHAR (255)	NOT NULL	UNIQUE,
		currency		NUMERIC (13, 4)	NOT NULL,
		CONSTRAINT currency_non_negative CHECK (currency >= 0),
		user_types_id	INT				NOT NULL,
		histories_id	INT				NOT NULL,
		FOREIGN KEY (user_types_id)
			REFERENCES user_types (id),
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);
	CREATE TABLE building_types (
		id				SERIAL			PRIMARY KEY,
		name			VARCHAR (255)	NOT NULL	UNIQUE,
		histories_id	INT				NOT NULL,
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);
	CREATE TABLE buildings (
		id					SERIAL			PRIMARY KEY,
		battery_buffer		NUMERIC (13, 4)	NOT NULL,
		battery_limit		NUMERIC (13, 4)	NOT NULL,
		CONSTRAINT battery_buffer_does_not_exceed_limit CHECK (battery_buffer <= battery_limit),
		building_types_id	INT				NOT NULL,
		owner_id			INT				NOT NULL,
		histories_id		INT				NOT NULL,
		FOREIGN KEY (building_types_id)
			REFERENCES building_types (id),
		FOREIGN KEY (owner_id)
			REFERENCES users (id),
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);
	CREATE TABLE transactions (
		id						SERIAL			PRIMARY KEY,
		currency				NUMERIC (13, 4)	NOT NULL,
		electricity				NUMERIC (13, 4)	NOT NULL,
		sender_users_id			INT				NOT NULL,
		receiver_users_id		INT				NOT NULL,
		sender_buildings_id		INT				NOT NULL,
		receiver_buildings_id	INT				NOT NULL,
		histories_id			INT				NOT NULL,
		FOREIGN KEY (sender_users_id)
			REFERENCES users (id),
		FOREIGN KEY (receiver_users_id)
			REFERENCES users (id),
		FOREIGN KEY (sender_buildings_id)
			REFERENCES buildings (id),
		FOREIGN KEY (receiver_buildings_id)
			REFERENCES buildings (id),
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);
	CREATE TABLE generator_types (
		id				SERIAL			PRIMARY KEY,
		name			VARCHAR (255)	NOT NULL	UNIQUE,
		histories_id 	INT				NOT NULL,
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);
	CREATE TABLE generators (
		id					SERIAL			PRIMARY KEY,
		base_output			NUMERIC (13, 4)	NOT NULL,
		is_broken			BOOLEAN			NOT NULL,
		generator_types_id	INT				NOT NULL,
		buildings_id		INT				NOT NULL,
		histories_id		INT				NOT NULL,
		FOREIGN KEY (generator_types_id)
			REFERENCES generator_types(id),
		FOREIGN KEY (buildings_id)
			REFERENCES buildings(id),
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);
	CREATE TABLE electricity_consumptions (
		id				SERIAL			PRIMARY KEY,
		amount			NUMERIC (13, 4)	NOT NULL,
		CONSTRAINT amount_non_negative_or_zero CHECK (amount > 0),
		buildings_id	INT				NOT NULL,
		histories_id	INT				NOT NULL,
		FOREIGN KEY (buildings_id)
			REFERENCES buildings (id),
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);
	CREATE TABLE electricity_productions (
		id				SERIAL			PRIMARY KEY,
		amount			NUMERIC (13, 4)	NOT NULL,
		CONSTRAINT amount_non_negative_or_zero CHECK (amount > 0),
		generators_id	INT				NOT NULL,
		buildings_id	INT				NOT NULL,
		histories_id	INT				NOT NULL,
		FOREIGN KEY (generators_id)
			REFERENCES generators (id),
		FOREIGN KEY (buildings_id)
			REFERENCES buildings (id),
		FOREIGN KEY (histories_id)
			REFERENCES histories (id)
	);`;

export const create = (): Promise<null> => db.none(createTables);

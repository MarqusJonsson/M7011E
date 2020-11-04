import { db } from './connect';

const createTables = `
	CREATE TABLE history (
		id		 SERIAL PRIMARY KEY,
		created_at TIMESTAMPTZ NOT NULL,
		updated_at TIMESTAMPTZ NOT NULL
	);
	CREATE TABLE roles (
		id		 SERIAL PRIMARY KEY,
		name	   VARCHAR (255) NOT NULL UNIQUE,
		history_id INT		   NOT NULL,
		FOREIGN KEY (history_id)
			REFERENCES history (id)
	);
	CREATE TABLE users (
		id			  SERIAL PRIMARY KEY,
		email		   VARCHAR (255) NOT NULL UNIQUE,
		currency		REAL		  NOT NULL,
		roles_id		INT		   NOT NULL,
		history_id	  INT		   NOT NULL,
		FOREIGN KEY (roles_id)
			REFERENCES roles (id),
		FOREIGN KEY (history_id)
			REFERENCES history (id)
	);
	CREATE TABLE transactions (
		id		  SERIAL PRIMARY KEY,
		amount	  REAL NOT NULL,
		sender_id   INT  NOT NULL,
		receiver_id INT  NOT NULL,
		history_id  INT  NOT NULL,
		FOREIGN KEY (sender_id)
			REFERENCES users (id),
		FOREIGN KEY (receiver_id)
			REFERENCES users (id),
		FOREIGN KEY (history_id)
			REFERENCES history (id)
	);
	CREATE TABLE building_types (
		id		 SERIAL PRIMARY KEY,
		name	   VARCHAR (255) NOT NULL UNIQUE,
		history_id INT		   NOT NULL,
		FOREIGN KEY (history_id)
			REFERENCES history (id)
	);
	CREATE TABLE buildings (
		id			 SERIAL PRIMARY KEY,
		battery_buffer REAL NOT NULL,
		battery_limit  REAL NOT NULL,
		type_id	  INT  NOT NULL,
		owner_id	   INT  NOT NULL,
		history_id	 INT  NOT NULL,
		FOREIGN KEY (type_id)
			REFERENCES building_types (id),
		FOREIGN KEY (owner_id)
			REFERENCES users (id),
		FOREIGN KEY (history_id)
			REFERENCES history (id)
	);
	CREATE TABLE generator_types (
		id		 SERIAL PRIMARY KEY,
		name	   VARCHAR (255) NOT NULL UNIQUE,
		history_id INT		   NOT NULL,
		FOREIGN KEY (history_id)
			REFERENCES history (id)
	);
	CREATE TABLE generators (
		id		   SERIAL PRIMARY KEY,
		base_output  REAL	NOT NULL,
		is_broken	BOOLEAN NOT NULL,
		type_id	INT	 NOT NULL,
		buildings_id INT	 NOT NULL,
		history_id   INT	 NOT NULL,
		FOREIGN KEY (type_id)
			REFERENCES generator_types(id),
		FOREIGN KEY (buildings_id)
			REFERENCES buildings(id),
		FOREIGN KEY (history_id)
			REFERENCES history (id)
	);
	CREATE TABLE generator_history_types (
		id		 SERIAL PRIMARY KEY,
		name	   VARCHAR (255) NOT NULL UNIQUE,
		history_id INT		   NOT NULL,
		FOREIGN KEY (history_id)
			REFERENCES history (id)
	);
	CREATE TABLE generator_history (
		id					  SERIAL PRIMARY KEY,
		amount				  REAL NOT NULL,
		type_id				  INT  NOT NULL,
		generators_id		  INT  NOT NULL,
		history_id			  INT  NOT NULL,
		FOREIGN KEY (type_id)
			REFERENCES generator_history_types (id),
		FOREIGN KEY (generators_id)
			REFERENCES generators (id),
		FOREIGN KEY (history_id)
			REFERENCES history (id)
);`;

export const create = () => db.none(createTables);

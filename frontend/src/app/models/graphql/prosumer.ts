import { Battery } from './battery';
import { GeoData } from './geoData';
import { House, houseContent, houseContentWithLimitedPowerPlant } from './house';
import { PowerPlant } from './powerPlant';

// Content
export const prosumerContent = `
	prosumer {
		currency
		isBlocked
		${houseContent}
	}`;

export const prosumerContentById = `
	prosumer (id: $id) {
		currency
		isBlocked
		${houseContentWithLimitedPowerPlant}
	}`;

// Queries
export const prosumerQuery = `
	query prosumer {
		${prosumerContent}
	}`;


export const prosumerQueryById = `
	query prosumerById ($id: ID!) {
		${prosumerContentById}
	}`;

// Mutations
export const setProsumerSellTimeoutMutation = `
	mutation setProsumerSellTimeoutMutation ($id: ID!, $seconds: Float!) {
		setProsumerSellTimeout(id: $id, seconds: $seconds) {
			id
			isBlocked
		}
	}`;

export const deleteProsumerMutation = `
	mutation deleteProsumerMutation ($id: ID!) {
		deleteProsumer(id: $id) {
			id
		}
	}`;

// Query results
export interface ProsumerQueryData {
	prosumer: Prosumer;
}

// Data structure
export interface Prosumer {
	id: number;
	currency: number;
	isBlocked: boolean;
	isOnline: boolean;
	house: House;
}

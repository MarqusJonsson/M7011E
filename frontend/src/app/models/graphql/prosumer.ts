import { houseContent, houseContentWithoutPowerPlant } from './house';

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
		${houseContentWithoutPowerPlant}
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

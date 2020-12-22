export const setProsumerSellTimeoutMutation = `mutation setProsumerSellTimeoutMutation ($id: ID!, $seconds: Float!) {
	setProsumerSellTimeout(id: $id, seconds: $seconds) {
		id
		isBlocked
	}
}`;

export const deleteProsumerMutation = `mutation deleteProsumerMutation ($id: ID!) {
	deleteProsumer(id: $id) {
		id
	}
}`;

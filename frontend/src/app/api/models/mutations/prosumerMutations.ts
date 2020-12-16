export const setProsumerSellTimeoutMutation = `mutation setProsumerSellTimeoutMutation ($id: ID!, $seconds: Float!) {
	setProsumerSellTimeout(id: $id, seconds: $seconds) {
		id
		isBlocked
	}
}`;


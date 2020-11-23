import { Identifier } from '../../identifiable';
import { Simulator } from '../../simulator';

export class GraphQLContext {
	public simulator: Simulator;
	public user: Identifier;

	constructor(simulator: Simulator, user: Identifier) {
		this.simulator = simulator;
		this.user = user;
	}
}

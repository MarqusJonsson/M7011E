import { GraphQLError } from 'graphql';
import { BaseGenerator } from '../../generators/baseGenerator';
import { Identifier } from '../../identifiable';
import { Simulator } from '../../simulator';
import { Manager } from '../../users/manager';
import { Prosumer } from '../../users/prosumer';
import { GraphQLErrorName } from '../schemas/graphQLErrors';

class GeneratorResolver {
	findByUser = (simulator: Simulator, userIdentifier: Identifier) => {
		const user: Prosumer | Manager | undefined = simulator.users.uGet(userIdentifier);
		if (user === undefined) throw new GraphQLError(GraphQLErrorName.USER_NOT_FOUND);
		const generators: any[] = [];
		user.building.generators.forEach((_generator) => {
			const generator: any = {};
			generator.id = _generator.id;
			generator.baseOutput = _generator.baseOutput;
			generator.isBroken = _generator.isBroken;
			generator.pollution = _generator.pollution;
			generators.push(generator);
		});
		return generators;
	}

	public findByHouse = (simulator: Simulator, houseIdentifier: Identifier) => {
		let _generators: BaseGenerator[] | undefined;
		simulator.prosumers.forEach((prosumer) => {
			if (prosumer.building.id === houseIdentifier.id) {
				_generators = prosumer.building.generators;
				return;
			}
		});
		if (_generators === undefined) throw new GraphQLError(GraphQLErrorName.GENERATORS_NOT_FOUND);
		const generators: any[] = [];
		_generators.forEach((_generator) => {
			const generator: any = {};
			generator.id = _generator.id;
			generator.baseOutput = _generator.baseOutput;
			generator.isBroken = _generator.isBroken;
			generator.pollution = _generator.pollution;
			generators.push(generator);
		});
		return generators;
	}
}

export const generatorResolver = new GeneratorResolver();

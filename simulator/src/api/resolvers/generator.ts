import { GraphQLError } from "graphql";
import { Manager } from "../../users/manager";
import { Prosumer } from "../../users/prosumer";
import { GraphQLContext } from "../schemas/graphQLContext";
import { GraphQLErrorName } from "../schemas/graphQLErrors";

class GeneratorResolver {
	all = (context: GraphQLContext) => {
		switch (context.user.type) {
			case Prosumer.name: {
				const prosumer: Prosumer | undefined = context.simulator.prosumers.get(context.user.id);
				if (prosumer === undefined) throw new GraphQLError(GraphQLErrorName.PROSUMER_NOT_FOUND);
				const generators: any[] = [];
				prosumer.house.generators.forEach((_generator) => {
					const generator: any = {};
					generator.id = _generator.id;
					generator.baseOutput = _generator.baseOutput;
					generator.isBroken = _generator.isBroken;
					generator.pollution = _generator.pollution;
					generators.push(generator);
				});
				return generators;
			}
			case Manager.name:
				const manager: Manager | undefined = context.simulator.managers.get(context.user.id);
				if (manager === undefined) throw new GraphQLError(GraphQLErrorName.MANAGER_NOT_FOUND);
				const generators: any[] = [];
				manager.powerPlant.generators.forEach((_generator) => {
					const generator: any = {};
					generator.id = _generator.id;
					generator.baseOutput = _generator.baseOutput;
					generator.isBroken = _generator.isBroken;
					generator.pollution = _generator.pollution;
					generators.push(generator);
				});
				return generators;
			default:
				throw new GraphQLError(GraphQLErrorName.INVALID_USER_TYPE);
		}
	}
}

export const generatorResolver = new GeneratorResolver();

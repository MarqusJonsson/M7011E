import { graphqlHTTP } from "express-graphql";
import { formatError, GraphQLError, GraphQLSchema } from "graphql";
import { IncomingMessage } from "http";
import { GraphQLContext } from "../api/schemas/graphQLContext";
import { getCode } from "../api/schemas/graphQLErrors";
import { rootMutation } from "../api/schemas/root/mutations";
import { rootQuery } from "../api/schemas/root/queries";
import { Identifier } from "../identifiable";
import { Simulator } from "../simulator";
import { UserRole } from "../userRole";
import { Manager } from "../users/manager";
import { Prosumer } from "../users/prosumer";
import { Forbidden } from "../utils/error";
import { faker } from "../utils/faker";

const schema = new GraphQLSchema({
	query: rootQuery,
	mutation: rootMutation
});

const unallowedProsumerIds: number[] = [];

export function graphQLHTTP(simulator: Simulator) {
	return graphqlHTTP((request) => ({
		schema: schema,
		context: setupGraphQLContext(request, simulator),
		customFormatErrorFn: (error) => {
			const errorCode = getCode(error.message);
			if (errorCode === undefined) {
				return formatError(error); // For debuggining purposes
			} else {
				return ({ message: error.message, errorCode: errorCode }); // For user experience purposes
			}
		},
		graphiql: true
	}));
}

function setupGraphQLContext(request: IncomingMessage, simulator: Simulator): GraphQLContext {
	const user = (<any> request).payload.user;
	let userIdentifier;
	switch (user.role) {
		case UserRole.PROSUMER:
			let prosumer = simulator.prosumers.uGet(new Identifier(Prosumer.name, user.id));
			if (prosumer === undefined) {
				if (unallowedProsumerIds.includes(user.id)) {
					throw new Forbidden('This user has been removed');
				}
				unallowedProsumerIds.push(user.id);
				// Prosumer whom sent the request does not exist in the simulator
				prosumer = faker.createProsumer(user.id);
				simulator.addProsumer(prosumer);
			}
			userIdentifier = prosumer.identifier;
			break;
		case UserRole.MANAGER:
			let manager = simulator.managers.uGet(new Identifier(Manager.name, user.id));
			if (manager === undefined) {
				// Manager whom sent the request does not exist in the simulator
				manager = faker.createManager(user.id);
				simulator.addManager(manager);
			}
			userIdentifier = manager.identifier
			break;
		default:
			throw new GraphQLError('The value \'role\' of the header \'user\' in the request must be a valid role');
	}
	return new GraphQLContext(simulator, userIdentifier);
}

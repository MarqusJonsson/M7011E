import express from 'express';
// Middleware
import bodyParser from 'body-parser';
import { cors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
// GraphQL
import { formatError, GraphQLError, GraphQLSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { rootQuery } from './api/schemas/root/queries';
import { rootMutation } from './api/schemas/root/mutations';
import { Simulator } from './simulator';
import { getCode } from './api/schemas/graphQLErrors';
import { GraphQLContext } from './api/schemas/graphQLContext';
import { Identifier } from './identifiable';
import { IncomingMessage } from 'http';
import { authenticateAccessToken } from './authentication';
import * as dotenv from 'dotenv';
import { Prosumer } from './users/prosumer';
import { Manager } from './users/manager';
import { faker } from './utils/faker';
import { UserRole } from './userRole';
dotenv.config();

export class Server {
	private _app: any;
	constructor(simulator: Simulator) {
		const schema = new GraphQLSchema({
			query: rootQuery,
			mutation: rootMutation
		});
		// Setup server
		const PORT = process.env.SERVER_PORT || 3002;
		this._app = express();
		// Setup middleware
		this._app.use(bodyParser.json());
		this._app.use(cors(['http://localhost:3002', 'http://localhost:4200']));
		this._app.use('/graphiql', authenticateAccessToken, graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1}), graphqlHTTP((req, res) => ({
			schema: schema,
			context: setupGraphQLContext(req, simulator),
			customFormatErrorFn: (error) => {
				const errorCode = getCode(error.message);
				if (errorCode === undefined) {
					return formatError(error); // For debuggining purposes
				} else {
					return ({ message: error.message, errorCode: errorCode }); // For user experience purposes
				}
			},
			graphiql: true
		})));
		this._app.use(errorHandler);
		// Start server
		this._app.listen(PORT, () => console.log(`Simulator server listening on port ${PORT}`));
	}
}

function setupGraphQLContext(request: IncomingMessage, simulator: Simulator): GraphQLContext {
	const user = (<any> request).payload.user;
	let userIdentifier;
	switch (user.role) {
		case UserRole.PROSUMER:
			let prosumer = simulator.prosumers.uGet(new Identifier(Prosumer.name, user.id));
			if (prosumer === undefined) {
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

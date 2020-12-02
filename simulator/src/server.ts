import express, { request } from 'express';
// Middleware
import bodyParser from 'body-parser';
import { cors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
// GraphQL
import { formatError, GraphQLSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { rootQuery } from './api/schemas/root/queries';
import { rootMutation } from './api/schemas/root/mutations';
import { Simulator } from './simulator';
import { getCode } from './api/schemas/graphQLErrors';
import { GraphQLContext } from './api/schemas/graphQLContext';
import { Identifier } from './identifiable';
import { IncomingMessage } from 'http';
import { authenticateAccessToken } from './authentication';
import * as dotenv from 'dotenv';
dotenv.config();

export class Server {
	private _app: any;
	constructor(simulator: Simulator) {
		const schema = new GraphQLSchema({
			query: rootQuery,
			mutation: rootMutation
		});
		// Setup server
		const PORT = process.env.SIMULATOR_SERVER_PORT;
		this._app = express();
		// Setup middleware
		this._app.use(bodyParser.json());
		this._app.use(cors(['http://localhost:3002', 'http://localhost:4200']));
		this._app.use('/graphiql', graphqlHTTP((req, res) => ({
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
		this._app.get('/temp', authenticateAccessToken, (request: express.Request, response: express.Response) => {
			response.json({ "Authenticated user payload": request.payload });
		});
		this._app.use(errorHandler);
		// Start server
		this._app.listen(PORT, () => console.log(`Simulator server listening on port ${PORT}`));
	}
}

function setupGraphQLContext(req: IncomingMessage, simulator: Simulator): GraphQLContext {
	const userStr = req.headers['user'];
	if (userStr === undefined || Array.isArray(userStr)) {
		throw new Error('No user in header');
	}
	const user = JSON.parse(userStr);
	return new GraphQLContext(simulator, new Identifier(user.type, parseInt(user.id)));
}

import express from 'express';
// Middleware
import bodyParser from 'body-parser';
import { cors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { authenticateAccessToken as accessTokenRequired } from './middleware/authentication';
import { graphQLHTTP } from './middleware/graphql';
import { graphQLUpload } from './middleware/graphqlUpload';
import { profilePicture } from './middleware/profilePicture';
//
import { Simulator } from './simulator';
import * as dotenv from 'dotenv';
dotenv.config();

export class Server {
	private _app: any;
	constructor(simulator: Simulator) {
		// Setup server
		const PORT = process.env.SERVER_PORT || 3002;
		this._app = express();
		// Setup middleware
		this._app.use(bodyParser.json());
		this._app.use(cors(['http://localhost:3002', 'http://localhost:4200']));
		this._app.use('/graphiql', accessTokenRequired, graphQLUpload(), graphQLHTTP(simulator));
		this._app.get('/profile-picture/:userId', accessTokenRequired, profilePicture);
		this._app.use(errorHandler);
		// Start server
		this._app.listen(PORT, () => console.log(`Simulator server listening on port ${PORT}`));
	}
}

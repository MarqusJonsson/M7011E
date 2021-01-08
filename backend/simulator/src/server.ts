import express from 'express';
import https from 'https';
import fs from 'fs';
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
const sslKey = fs.readFileSync(process.cwd() + '/ssl/server.key');
const sslCrt = fs.readFileSync(process.cwd() + '/ssl/server.crt');
const serverOptions = { key: sslKey, cert: sslCrt };

export class Server {
	private _app = express();
	private _server = https.createServer(serverOptions, this._app);
	constructor(simulator: Simulator) {
		// Setup server
		const PORT = process.env.SERVER_PORT || 3002;
		// Setup middleware
		this._app.use(bodyParser.json());
		this._app.use(cors(['https://localhost:4200']));
		this._app.use('/graphiql', accessTokenRequired, graphQLUpload(), graphQLHTTP(simulator));
		this._app.get('/profile-picture/:userId', accessTokenRequired, profilePicture);
		this._app.use(errorHandler);
		// Start server
		this._server.listen(PORT, () => console.log(`Simulator server listening on port ${PORT}`));
	}
}

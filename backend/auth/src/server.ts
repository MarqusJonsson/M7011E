import express from 'express';
import https from 'https';
import fs from 'fs';
// Middleware
import bodyParser from 'body-parser';
import { corsHandler } from './middleware/cors';
import { errorHandler } from './middleware/errors';
import * as dotenv from 'dotenv';
import { database } from './database/database';
import { GetResult, DeleteResult, PostResult, PutResult } from './api/result';
import { authentication as authenticationAPI } from './api/authentication';
import { authentication } from './utils/authentication';
import { StatusCode } from './utils/statusCode';
import { users as usersAPI } from './api/users';
dotenv.config();

// Setup server
console.log('Setting up server...');
const sslKey = fs.readFileSync(__dirname + '/../ssl/server.key');
const sslCrt = fs.readFileSync(__dirname + '/../ssl/server.crt');
const serverOptions = { key: sslKey, cert: sslCrt };
const PORT = process.env.SERVER_PORT || 3001;
const app = express();
const server = https.createServer(serverOptions, app);
// Create / load crypto key pairs
const refreshPrivateKeyPath = process.env.PATH_REFRESH_PRIVATE_KEY || 'refreshPrivate.key';
const refreshPublicKeyPath = process.env.PATH_REFRESH_PUBLIC_KEY || 'refreshPublic.key';
const accessPrivateKeyPath = process.env.PATH_ACCESS_PRIVATE_KEY || 'accessPrivate.key';
const accessPublicKeyPath = process.env.PATH_ACCESS_PUBLIC_KEY || 'accessPublic.key';
const refreshTokenExpireSeconds = process.env.REFRESH_TOKEN_EXPIRE_SECONDS || 14 * 24 * 60 * 60;
console.log('Creating authentication key pairs...')
authentication.createKeyPairs(refreshPrivateKeyPath, refreshPublicKeyPath, accessPrivateKeyPath, accessPublicKeyPath)
console.log('Finished creating authentication key pairs');
// Create database tables
console.log('Creating database tables...')
database.task((t) => {
	return database.histories.createTable(t).then(() => {
		return database.users.createTable(t).then(() => {
			return database.refreshTokens.createTable(t).then(() => {
				console.log('Finished creating database tables')
				// Remove expired refresh tokens every hour
				initiateDeleteExpiredRefreshTokensInterval(60 * 60 * 1000); // 60 * 60 * 1000ms
				// Setup middleware
				app.use(bodyParser.json());
				app.use(bodyParser.urlencoded({extended:true}));
				app.use(corsHandler(['https://localhost:4200']));
				// Setup API endpoints
				POST	('/register', authenticationAPI.register);
				POST	('/login', authenticationAPI.login);
				POST	('/refresh-access-token', authenticationAPI.refreshAccessToken);
				DELETE	('/logout', authenticationAPI.logout);
				DELETE	('/users/:id', usersAPI.delete);
				// Setup error handler middleware
				app.use(errorHandler);
				// Start server
				server.listen(PORT, () => console.log(`Auth server listening on port ${PORT}`));
			});
		});
	});
});

function initiateDeleteExpiredRefreshTokensInterval(ms: number) {
	setInterval(() => {
		database.refreshTokens.deleteOld(+refreshTokenExpireSeconds);
	}, ms); 
}

// Generic GET handler
function GET(url: string, handler: (request: any, response: any) => Promise<GetResult>) {
	app.get(url, (request, response, next) => {
		handler(request, response).then((result) => {
			response.status(StatusCode.OK);
			response.json({
				success: true,
				body: result.body
			});
		}).catch((error: any) => { next(error); });
	});
};
// Generic POST handler
function POST(url: string, handler: (request: any, response: any) => Promise<PostResult>) {
	app.post(url, (request, response, next) => {
		handler(request, response).then((result) => {
			response.status(StatusCode.CREATED);
			response.setHeader('Location', result.location);
			response.json({
				success: true,
				body: result.body
			});
		}).catch((error: any) => { next(error); });
	});
};
// Generic PUT handler
function PUT(url: string, handler: (request: any, response: any) => Promise<PutResult>) {
	app.put(url, (request, response, next) => {
		handler(request, response).then((result) => {
			const responseObject: any = {success: true};
			if (result.body === null) {
				response.status(StatusCode.NO_CONTENT);
			} else {
				response.status(StatusCode.OK);
				responseObject.data = result.body;
			}
			response.json(responseObject);
		}).catch((error: any) => { next(error); });
	});
};
// Generic DELETE handler
function DELETE(url: string, handler: (request: any, response: any) => Promise<DeleteResult>) {
	app.delete(url, (request, response, next) => {
		handler(request, response).then((result) => {
			const responseObject: any = {success: true};
			if (result.body === null) {
				response.status(StatusCode.NO_CONTENT);
			} else {
				response.status(StatusCode.OK);
				responseObject.body = result.body;
			}
			response.json(responseObject);
		}).catch((error: any) => { next(error); });
	});
};

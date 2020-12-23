import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { BadRequest, Unauthorized } from '../utils/error';
import * as dotenv from 'dotenv';
dotenv.config();

const accessPrivateKeyPath = process.env.PATH_ACCESS_PRIVATE_KEY || 'accessPrivate.key';
const signingAlgorithm = 'RS256';
const accessPrivateKey = loadAccesPrivateKey(accessPrivateKeyPath);

function loadAccesPrivateKey(accessPrivateKeyPath: string) {
	try {
		return crypto.createPrivateKey(fs.readFileSync(accessPrivateKeyPath));
	} catch {
		throw new Error('Can not find access private key at \'' + accessPrivateKeyPath + '\'');
	}
};

function verifyAccessToken(token: string, callback: jwt.VerifyCallback) {
	if (accessPrivateKey == undefined) throw new Error('Can not verify access tokens: missing access private key');
	jwt.verify(token, <jwt.Secret><unknown> accessPrivateKey, {
		algorithms: [signingAlgorithm]
	}, callback);
}

export function authenticateAccessToken(request: express.Request, response: express.Response, next: express.NextFunction) {
	const authHeader = request.headers.authorization;
	const accessToken = authHeader && authHeader.split(' ')[1];
	if (accessToken === undefined) throw new BadRequest('The request contains a malformed required header: Authorization');
	verifyAccessToken(accessToken, (error, payload) => {
		if (error) next(new Unauthorized(error.message)); // TODO use error parser instead
		request.payload = payload;
		next();
	});
}

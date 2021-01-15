import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { BadRequest, Unauthorized } from '../utils/error';
import * as dotenv from 'dotenv';
dotenv.config();

const accessPublicKeyPath = process.env.PATH_ACCESS_PUBLIC_KEY || 'accessPublic.key';
const signingAlgorithm = 'RS256';
const accessPublicKey = loadAccesPublicKey(accessPublicKeyPath);

function loadAccesPublicKey(accessPublicKeyPath: string) {
	try {
		return crypto.createPublicKey(fs.readFileSync(accessPublicKeyPath));
	} catch {
		throw new Error('Can not find access public key at \'' + accessPublicKeyPath + '\'');
	}
};

function verifyAccessToken(token: string, callback: jwt.VerifyCallback) {
	if (accessPublicKey == undefined) throw new Error('Can not verify access tokens: missing access public key');
	jwt.verify(token, <jwt.Secret><unknown> accessPublicKey, {
		algorithms: [signingAlgorithm]
	}, callback);
}

export function authenticateAccessToken(request: express.Request, response: express.Response, next: express.NextFunction) {
	const authHeader = request.headers.authorization;
	const accessToken = authHeader && authHeader.split(' ')[1];
	if (accessToken === undefined) throw new BadRequest('The request contains a malformed required header: Authorization');
	verifyAccessToken(accessToken, (error, payload) => {
		if (error) {
			next(new Unauthorized(error.message)); // TODO use error parser instead
			return;
		}
		request.payload = payload;
		next();
	});
}

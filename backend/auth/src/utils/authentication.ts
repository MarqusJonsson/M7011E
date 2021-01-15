import jwt from 'jsonwebtoken';
import fs from 'fs';
import * as dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const refreshTokenExpireSeconds = process.env.REFRESH_TOKEN_EXPIRE_SECONDS || 1 * 24 * 60 * 60;
const accessTokenExpireSeconds = process.env.ACCESS_TOKEN_EXPIRE_SECONDS || 5 * 60;
const refreshTokenExpireTime = refreshTokenExpireSeconds + 's';
const accessTokenExpireTime = accessTokenExpireSeconds + 's';
const signingAlgorithm = 'RS256';

let refreshKeyPair: KeyPair | undefined;
let accessKeyPair: KeyPair | undefined;

function writeKeyToFile(path: string, key: crypto.KeyObject) {
	const keyString = key.export({ type:'pkcs1', format:'pem' });
	fs.writeFileSync(path, keyString);
}

class KeyPair {
	public privateKey: crypto.KeyObject;
	public publicKey: crypto.KeyObject;
	constructor(privateKeyPath = 'NON_EXISTING_KEY_PATH') {
		try {
			this.privateKey = crypto.createPrivateKey(fs.readFileSync(privateKeyPath));
			this.publicKey = crypto.createPublicKey(this.privateKey);
		} catch {
			const keyPair = crypto.generateKeyPairSync('rsa', {
				modulusLength: 2048
			});
			this.privateKey = keyPair.privateKey;
			this.publicKey = keyPair.publicKey;
		}
	}
}
function createKeyPairs(refreshPrivateKeyPath: string, refreshPublicKeyPath: string, accessPrivateKeyPath: string, accessPublicKeyPath: string) {
	refreshKeyPair = new KeyPair(refreshPrivateKeyPath);
	writeKeyToFile(refreshPrivateKeyPath, refreshKeyPair.privateKey);
	writeKeyToFile(refreshPublicKeyPath, refreshKeyPair.publicKey);
	accessKeyPair = new KeyPair(accessPrivateKeyPath);
	writeKeyToFile(accessPrivateKeyPath, accessKeyPair.privateKey);
	writeKeyToFile(accessPublicKeyPath, accessKeyPair.publicKey);
}

export interface RefreshTokenPayload {
	user: {
		id: number
	},
	refreshToken: {
		id: number
	}
}

function generateRefreshToken(payload: RefreshTokenPayload) {
	if (refreshKeyPair == undefined) throw new Error('Missing refresh key pair');
	const signed = jwt.sign(payload, <jwt.Secret><unknown> refreshKeyPair.privateKey, {
		expiresIn: refreshTokenExpireTime,
		algorithm: signingAlgorithm
	});
	return signed;
}

function verifyRefreshToken(token: string, callback: jwt.VerifyCallback, options?: jwt.VerifyOptions) {
	if (refreshKeyPair == undefined) throw new Error('Missing refresh key pair');
	jwt.verify(token, <jwt.Secret><unknown> refreshKeyPair.publicKey, {
		...{algorithms: [signingAlgorithm]}, ...options || {} 
	}, callback);
}

function generateAccessToken(payload: string | object | Buffer) {
	if (accessKeyPair == undefined) throw new Error('Missing access key pair');
	return jwt.sign(payload, <jwt.Secret><unknown> accessKeyPair.privateKey, {
		expiresIn: accessTokenExpireTime,
		algorithm: signingAlgorithm
	});
}

function verifyAccessToken(token: string, callback: jwt.VerifyCallback) {
	if (accessKeyPair == undefined) throw new Error('Missing access key pair');
	jwt.verify(token, <jwt.Secret><unknown> accessKeyPair.publicKey, {
		algorithms: [signingAlgorithm]
	}, callback);
}

export const authentication = {
	createKeyPairs: createKeyPairs,
	generateRefreshToken: generateRefreshToken,
	generateAccessToken: generateAccessToken,
	verifyRefreshToken: verifyRefreshToken,
	verifyAccessToken: verifyAccessToken
}

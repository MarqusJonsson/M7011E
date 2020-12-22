import { database } from '../database/database';
import { authentication as auth, RefreshTokenPayload } from '../utils/authentication';
import { ResponseError } from '../utils/error';
import { validation } from '../utils/validation';
import { PostResult, DeleteResult } from './result';
import { crypto } from '../utils/crypto';
import express from 'express';
import { StatusCode } from '../utils/statusCode';
import { UsersRepository } from '../database/repositories';

function register(request: express.Request): Promise<PostResult> {
	return new Promise((resolve, reject) => {
		const { email, password } = request.body;
		if (!validation.validateEmail(email) || !validation.validatePassword(password)) {
			reject(new ResponseError('Malformed input', StatusCode.BAD_REQUEST));
		} else {
			return crypto.hash(password).then((hashedPassword) => {
				return database.tx((t => {
					return database.users.insert(<string> email, hashedPassword, t).then((userId) => {
						return database.refreshTokens.getNextId(t).then((refreshTokenId) => {
							const user = {
								id: userId,
								role: UsersRepository.defaultUserRole
							}
							const accessToken = auth.generateAccessToken({
								user: user
							});
							const refreshToken = auth.generateRefreshToken({
								user: user,
								refreshToken: { id: refreshTokenId }
							});
							return crypto.hash(refreshToken).then((hashedRefreshToken) => {
								return database.refreshTokens.insert(refreshTokenId, hashedRefreshToken, userId, t).then((refreshTokenId) => {
									resolve(new PostResult({
										accessToken: accessToken,
										refreshToken: refreshToken
									}, `/users/${user.id}`));
								}).catch((error) => { reject(error); });
							}).catch((error) => { console.error(error); reject(new ResponseError()); });
						}).catch((error) => { reject(error); });
					}).catch((error) => { reject(error); });
				})).catch((error) => { reject(error); });
			}).catch((error) => { console.error(error); reject(new ResponseError()); });
		}
	});
}

function login(request: express.Request): Promise<PostResult> {
	return new Promise((resolve, reject) => {
		const { email, password } = request.body;
		if (!validation.validateEmail(email) || !validation.validatePassword(password)) {
			reject(new ResponseError('Malformed input', StatusCode.BAD_REQUEST));
		} else {
			return database.tx((t => {
				return database.users.findPasswordByEmail(<string> email, t).then((user_) => {
					return crypto.verifyHash(password, user_.password).then((authorized) => {
						if (authorized) {
							return database.refreshTokens.getNextId(t).then((refreshTokenId) => {
								const user = {
									id: user_.id,
									role: user_.role
								}
								const accessToken = auth.generateAccessToken({
									user: user
								});
								const refreshToken = auth.generateRefreshToken({
									user: user,
									refreshToken: { id: refreshTokenId }
								});
								return crypto.hash(refreshToken).then((hashedRefreshToken) => {
									return database.refreshTokens.insert(refreshTokenId, hashedRefreshToken, user.id, t).then((insertedRefreshTokenId) => {
										resolve(new PostResult({
											accessToken: accessToken,
											refreshToken: refreshToken
										}, `/users/${user.id}`));
									}).catch((error) => { reject(error); });
								}).catch((error) => { console.error(error); reject(new ResponseError()); });
							}).catch((error) => { reject(error); });
						} else {
							reject(new ResponseError('Invalid email or password', StatusCode.UNAUTHORIZED));
						}
					}).catch((error) => { console.error(error); reject(new ResponseError()); });
				}).catch((error) => { reject(error); });
			})).catch((error) => { reject(error); });
		}
	});
}

function logout(request: express.Request): Promise<DeleteResult> {
	return new Promise((resolve, reject) => {
		const authHeader = request.headers.authorization;
		const refreshToken = authHeader && authHeader.split(' ')[1];
		if (refreshToken === undefined) {
			reject(new ResponseError('The request is missing or contains a malformed required header: Authorization', StatusCode.BAD_REQUEST));
		} else {
			auth.verifyRefreshToken(refreshToken, (error, payload) => {
				if (error) {
					reject(new ResponseError('Invalid refresh token', StatusCode.FORBIDDEN));
					return;
				}
				const refreshTokenPayload: RefreshTokenPayload = <RefreshTokenPayload><unknown>payload;
				return database.refreshTokens.delete(refreshTokenPayload.refreshToken.id).then((deletedRefreshTokenId) => {
					resolve(new DeleteResult(null));
				}).catch((error) => { reject(error); });
			}, { ignoreExpiration: true });
		}
	});
}

function refreshAccessToken(request: express.Request): Promise<PostResult> {
	return new Promise((resolve, reject) => {
		const authHeader = request.headers.authorization;
		const refreshToken = authHeader && authHeader.split(' ')[1];
		if (refreshToken === undefined) {
			reject(new ResponseError('The request is missing or contains a malformed required header: Authorization', StatusCode.BAD_REQUEST));
		} else {
			auth.verifyRefreshToken(refreshToken, (error, payload) => {
				if (error) reject(new ResponseError('Invalid refresh token', StatusCode.FORBIDDEN));
				const refreshTokenPayload = <RefreshTokenPayload><unknown> payload;
				const accessToken = auth.generateAccessToken({
					user: refreshTokenPayload.user
				});
				resolve(new PostResult({
					accessToken: accessToken,
					refreshToken: refreshToken
				}, `/users/${refreshTokenPayload.user.id}`));
			});
		}
	});
}

export const authentication = {
	register: register,
	login: login,
	logout: logout,
	refreshAccessToken: refreshAccessToken
}

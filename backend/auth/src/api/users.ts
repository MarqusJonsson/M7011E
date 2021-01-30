import { database } from '../database/database'
import { ResponseError } from '../utils/error';
import { validation } from '../utils/validation';
import { DeleteResult, GetResult, PostResult, PutResult } from './result';
import express from 'express';
import { crypto } from '../utils/crypto';
import { StatusCode } from '../utils/statusCode';
import { UsersRepository } from '../database/repositories';

function getAll(): Promise<GetResult> {
	return new Promise((resolve, reject) => {
		// TODO: Make sure requester has permission to get all users
		database.users.all().then((users) => {
			resolve(new GetResult(users));
		}).catch((error) => { reject(error); });
	});
}

function find(request: express.Request): Promise<GetResult> {
	return new Promise((resolve, reject) => {
		// TODO: Make sure requester has permission to get a user
		const strId = request.params.id;
		const id = parseInt(strId);
		if (!validation.validateId(id)) {
			reject(new ResponseError('Malformed input', StatusCode.BAD_REQUEST));
		} else {
			database.users.find(id).then((user) => {
				resolve(new GetResult(user));
			}).catch((error) => { reject(error); });
		}
	});
}

function findByEmail(request: express.Request): Promise<GetResult> {
	return new Promise((resolve, reject) => {
		// TODO: Make sure requester has permission to get a user
		const email = request.params.email;
		if (!validation.validateEmail(email)) {
			reject(new ResponseError('Malformed input', StatusCode.BAD_REQUEST));
		} else {
			database.users.findByEmail(email).then((user) => {
				resolve(new GetResult(user));
			}).catch((error) => { reject(error); });
		}
	});
}

function delete_(request: express.Request): Promise<DeleteResult> {
	return new Promise((resolve, reject) => {
		if (request.payload.user.role !== UsersRepository.userRole.MANAGER) {
			reject(new ResponseError('Access denied', StatusCode.FORBIDDEN))
		} else {
			const strId = request.params.id;
			const id = parseInt(strId);
			if (!validation.validateId(id)) {
				reject(new ResponseError('Malformed input', StatusCode.BAD_REQUEST));
			} else {
				database.refreshTokens.deleteAllWithUserId(id).then(() => {
					database.users.delete(id).then((userId) => {
						resolve(new DeleteResult({ user: { id: userId } }));
					}).catch((error) => { reject(error); });
				}).catch((error) => { reject(error); });
			}
		}
	});
}

function empty(request: express.Request): Promise<DeleteResult> {
	// TODO: Make sure requester has permission to empty user table
	return new Promise((resolve, reject) => {
		database.users.empty().then(result => {
			resolve(new DeleteResult(result))
		}).catch((error) => { reject(error); });
	});
}

function updatePassword(request: express.Request): Promise<PutResult> {
	return new Promise((resolve, reject) => {
		if (request.payload.user.role !== UsersRepository.userRole.MANAGER) {
			reject(new ResponseError('Access denied', StatusCode.FORBIDDEN))
		} else {
			const strId = request.params.id;
			const id = parseInt(strId);
			const { password } = request.body;
			if (!validation.validateId(id) || !validation.validatePassword(password)) {
				reject(new ResponseError('Malformed input', StatusCode.BAD_REQUEST));
			} else {
				crypto.hash(password).then((hash) => {
					database.users.updatePassword(id, hash).then(() => {
						resolve(new PutResult(undefined));
					}).catch((error) => { reject(error); });
				}).catch((error) => {
					console.error(error);
					reject(new ResponseError());
				});
			}
		}
	});
}

function updateEmail(request: express.Request): Promise<PutResult> {
	return new Promise((resolve, reject) => {
		if (request.payload.user.role !== UsersRepository.userRole.MANAGER) {
			reject(new ResponseError('Access denied', StatusCode.FORBIDDEN))
		} else {
			const strId = request.params.id;
			const id = parseInt(strId);
			const { email } = request.body;
			if (!validation.validateId(id) || !validation.validateEmail(email)) {
				reject(new ResponseError('Malformed input', StatusCode.BAD_REQUEST));
			} else {
				database.users.updateEmail(id, email).then((user) => {
					database.refreshTokens.deleteAllWithUserId(user.id).then(() => {
						resolve(new PutResult(user));
					}).catch((error) => { reject(error); });
				}).catch((error) => { 
					console.error(error);
					reject(error);
				});
			}
		}
	});
}

export const users = {
	getAll: getAll,
	find: find,
	findByEmail: findByEmail,
	delete: delete_,
	empty: empty,
	updatePassword: updatePassword,
	updateEmail: updateEmail
}

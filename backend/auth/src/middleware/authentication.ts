import express from "express";
import { authentication } from '../utils/authentication'
import { ResponseError } from "../utils/error";
import { StatusCode } from "../utils/statusCode";

export function authenticateRefreshToken(request: express.Request, response: express.Response, next: express.NextFunction) {
	const authHeader = request.headers.authorization;
	const refreshToken = authHeader && authHeader.split(' ')[1];
	if (refreshToken === undefined) throw new ResponseError('The request contains a malformed required header: Authorization', StatusCode.BAD_REQUEST);
	authentication.verifyRefreshToken(refreshToken, (error, payload) => {
		if (error) {
			next(new ResponseError(error.message, StatusCode.UNAUTHORIZED)); // TODO use error parser instead
			return;
		}
		request.payload = payload;
		next();
	});
}
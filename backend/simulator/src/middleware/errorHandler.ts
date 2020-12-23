import express from 'express';
import { GeneralError } from '../utils/error';

export function errorHandler(error: any, request: express.Request, response: express.Response, next: express.NextFunction) {
	if (error instanceof GeneralError) {
		return response.status(error.getCode()).json({
			status: 'error',
			message: error.message
		});
	}

	return response.status(500).json({
		status: 'error',
		message: error.message
	});
};

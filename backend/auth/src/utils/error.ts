import { StatusCode } from './statusCode';

export class ResponseError extends Error {
	public readonly statusCode: StatusCode;

	constructor(message: string = 'Unknown server error', statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR) {
		super();
		this.message = message;
		this.statusCode = statusCode;
	}
}

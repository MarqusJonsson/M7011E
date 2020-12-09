
export class AuthError extends Error {
	constructor(message: string = 'Unknown authentication error') {
		super();
		this.message = message;
	}
}

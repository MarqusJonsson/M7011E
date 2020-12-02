function validateEmail(email: any): boolean {
	if (email !== undefined) {
		if(typeof email === 'string') {
			if (email.length > 0 && email.length < 254) {
				const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return mailRegex.test(email);
			}
		}
	}
	return false;
}

function validatePassword(password: any): boolean {
	if (password !== undefined) {
		if(typeof password === 'string') {
			if (password.length > 0 && password.length <= 254) {
				return true;
			}
		}
	}
	return false;
}

function validateRefreshToken(token: any): boolean {
	if (token !== undefined) {
		if(typeof token === 'string') {
			if (token.length === 64) {
				const tokenRegex = /^[A-Za-z0-9\+\/]*$/;
				return tokenRegex.test(token);
			}
		}
	}
	return false;	
}

function validateAccessToken(token: any): boolean {
	if (token !== undefined) {
		if(typeof token === 'string') {
			if (token.length === 344) {
				const tokenRegex = /^[A-Za-z0-9\+\/]*==$/;
				return tokenRegex.test(token);
			}
		}
	}
	return false;	
}

function validateId(id: any): boolean {
	if (id !== undefined) {
		if (typeof id === 'number') {
			if (!isNaN(id)) {
				if (id >= 0) {
					return true;
				}
			}
		}
	}
	return false;
}

export const validation = {
	validateEmail: validateEmail,
	validatePassword: validatePassword,
	validateRefreshToken: validateRefreshToken,
	validateAccessToken: validateAccessToken,
	validateId: validateId
}

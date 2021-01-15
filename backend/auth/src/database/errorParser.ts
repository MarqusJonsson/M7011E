import pgPromise from 'pg-promise';
import { ResponseError } from '../utils/error';
import { StatusCode } from '../utils/statusCode';

// PostgreSQL error codes appendix at https://www.postgresql.org/docs/13/errcodes-appendix.html
enum PostgreSQLErrorCodes {
	UNIQUE_VIOLATION = '23505'
}

enum PostgreSQLConstraints {
	USERS_EMAIL_KEY = 'users_email_key'
}

export function toResponseError(error: any): ResponseError {
	if (error instanceof ResponseError) {
		return error;
	} else if (error instanceof pgPromise.errors.QueryResultError) {
		return parseQueryResultError(error);
	} else {
		error = parsePostgreSQLError(error)
		return error;
	}
}

function parseQueryResultError(error: pgPromise.errors.QueryResultError) {
	switch (error.code) {
		case pgPromise.errors.queryResultErrorCode.noData:
			switch (error.result.command) {
				case 'DELETE':
				case 'SELECT':
					return new ResponseError('Requested resource to be deleted was not found', StatusCode.NO_CONTENT);
			}
	}
	return new ResponseError();
}

function parsePostgreSQLError(error: any) {
	switch (error.code) {
		case PostgreSQLErrorCodes.UNIQUE_VIOLATION:
			switch (error.constraint) {
				case PostgreSQLConstraints.USERS_EMAIL_KEY:
					return new ResponseError('Email is already in use', StatusCode.CONFLICT);
			}
	}
	return new ResponseError();
}

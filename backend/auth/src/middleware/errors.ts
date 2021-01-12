import { ResponseError } from '../utils/error';

export const errorHandler = (error: any, request: any, response: any, next: any) => {
	if (error instanceof ResponseError) {
		return response.status(error.statusCode).json({
			success: false,
			message: error.message
		});
	}
	return response.status(500).json({
		success: false,
		message: 'Unknown error!'
	});
}

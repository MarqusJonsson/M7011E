import { GeneralError } from '../utils/error';

const errorHandler = (err: any, req: any, res: any, next: any) => {
    if (err instanceof GeneralError) {
        return res.status(err.getCode()).json({
            status: 'error',
            message: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: err.message
    });
};

export { errorHandler };
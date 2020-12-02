import cors from 'cors'

export const corsHandler = (whitelist: string[]) => cors({
	origin: (origin, callback) => {
		// allow requests with no origin
		if (!origin) return callback(null, true);
		if (whitelist.indexOf(origin) === -1) {
		return callback(new Error('The CORS policy for this origin doesn\'t ' +
			'allow access from the particular origin.'))
		}
		return callback(null, true);
	}
});

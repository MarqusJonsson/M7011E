const URL_SIMULATOR_SERVER = 'http://localhost:3002';
const URL_AUTH_SERVER = 'http://localhost:3001';

export const config = {
	// API servers
	URL_SIMULATOR_SERVER: `${URL_SIMULATOR_SERVER}`,
	URL_AUTH_SERVER: `${URL_AUTH_SERVER}`,
	// Auth API URLs
	URL_LOGIN: `${URL_AUTH_SERVER}/login`,
	URL_LOGOUT: `${URL_AUTH_SERVER}/logout`,
	URL_REGISTER: `${URL_AUTH_SERVER}/register`,
	URL_DELETE_USER: `${URL_AUTH_SERVER}/users/`,
	URL_REFRESH_ACCESS_TOKEN: `${URL_AUTH_SERVER}/refresh-access-token`,
	// Simulator API URLs
	URL_GRAPHQL: `${URL_SIMULATOR_SERVER}/graphiql`,
	URL_PROFILE_PICTURE: (userId: number) => { return `${URL_SIMULATOR_SERVER}/profile-picture/${userId}`; },
	URL_AUTH_CHECK: `${URL_SIMULATOR_SERVER}/auth-check`,
	URL_TEMP: `${URL_SIMULATOR_SERVER}/temp`
};

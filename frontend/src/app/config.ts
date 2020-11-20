const URL_APP_SERVER = 'http://localhost:3000';
const URL_AUTH_SERVER = 'http://localhost:3001';

export const config = {
  // API servers
  URL_APP_SERVER: URL_APP_SERVER,
  URL_AUTH_SERVER: URL_AUTH_SERVER,
  // Auth URLs
  URL_GRAPHQL: `${URL_APP_SERVER}/graphql`,
  URL_LOGIN: `${URL_AUTH_SERVER}/login`,
  URL_LOGOUT: `${URL_AUTH_SERVER}/logout`,
  URL_REFRESH_TOKEN: `${URL_AUTH_SERVER}/refresh-token`,
  // App URLs
  URL_AUTH_CHECK: `${URL_APP_SERVER}/auth-check`
}
// Content
export const geoDataContent = `
	geoData {
		longitude
		latitude
		altitude
		windSpeed
		temperature
	}`;

// Query
export const geoDataQuery = `
	query geoData {
		${geoDataContent}
	}`;

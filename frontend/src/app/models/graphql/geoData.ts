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

// Query results
export interface GeoDataQueryResults {
	geoData: GeoData;
}

// Data structure
export interface GeoData {
	longitude: number;
	latitude: number;
	altitude: number;
	windSpeed: number;
	temperature: number;
}

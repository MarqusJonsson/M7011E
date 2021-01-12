// Content
export const batteryContent = `
	battery {
		buffer
		capacity
	}`;

// Queries
export const batteryQuery = `
	query battery {
		${batteryContent}
	}`;

// Query results
export interface BatteryQueryResults {
	battery: Battery;
}

// Data structure
export interface Battery {
	buffer: number;
	capacity: number;
}

import { Battery } from './battery';
import { PowerPlant, powerPlantContent } from './powerPlant';
import { Prosumer } from './prosumer';

// Content
export const managerContent = `
	manager {
		currency
		${powerPlantContent}
		prosumers {
			id
			house {
				hasBlackout
			}
		}
}`;

// Queries
export const managerQuery = `
	query manager {
		${managerContent}
	}`;

// Query results
export interface ManagerQueryData {
	manager: Manager;
}

// Data structure
export interface Manager {
	currency: number;
	isBlocked: boolean;
	powerPlant: PowerPlant;
	prosumers: Prosumer[];
}

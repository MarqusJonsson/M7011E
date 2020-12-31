import { powerPlantContent } from './powerPlant';

// Content
export const managerContent = `
	manager {
		currency
		${powerPlantContent}
		prosumers {
			id
			house
			{
				hasBlackout
			}
		}
}`;

// Queries
export const managerQuery = `
	query manager {
		${managerContent}
	}`;

import { userTypeResolver } from './resolvers/userType'
import { buildingTypeResolver } from './resolvers/buildingType'
import { generatorTypeResolver } from './resolvers/generatorType'
import { userResolver } from './resolvers/user'
import { buildingResolver } from './resolvers/building'
import { generatorResolver } from './resolvers/generator'
import { Prosumer } from '../users/prosumer';
import { House } from '../buildings/house'
import { WindTurbine } from '../generators/windTurbine'
import { CoalPowerPlant } from '../buildings/coalPowerPlant'
import { CoalGenerator } from '../generators/coalGenerator'
import { BaseUser } from '../users/baseUser'
import { Manager } from '../users/manager'
import { BaseBuilding } from '../buildings/baseBuilding'

export function populate(users: BaseUser<House | BaseBuilding>[]) {
	Promise.all([
		userTypeResolver.create(Prosumer.name),
		userTypeResolver.create(Manager.name),
		buildingTypeResolver.create(House.name),
		buildingTypeResolver.create(CoalPowerPlant.name),
		generatorTypeResolver.create(WindTurbine.name),
		generatorTypeResolver.create(CoalGenerator.name)
	]).then((values: [any, any, any, any, any, any]) => {
		const prosumerType = values[0]
		const managerType = values[1]
		const houseType = values[2]
		const coalPowerPlantType = values[3]
		const windTurbineType = values[4]
		const coalGeneratorType = values[5]
		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			switch (users[i].type) {
				case Prosumer.name:
					const prosumer = <Prosumer> user;
					// Create prosumer users in database
					userResolver.create(
						prosumer.type + '_' + prosumer.id + '@email.dom',
						prosumer.currency,
						prosumerType.id
					).then((dbProsumer) => {
						// Create prosumer houses in database
						const house = prosumer.building;
						buildingResolver.create(
							house.battery.buffer,
							house.battery.capacity,
							houseType.id,
							dbProsumer.id
						).then((dbHouse) => {
							// Create prosumer houses generators in database
							const generators = house.generators.values();
							for (const generator of generators) {
								generatorResolver.create(
									generator.baseOutput,
									generator.isBroken,
									windTurbineType.id,
									dbHouse.id
								);
							}
						});
					});
					break;
				case Manager.name:
					const manager = <Manager> user;
					// Create manager users in database
					userResolver.create(
						manager.type + '_' + manager.id + '@email.dom',
						manager.currency,
						managerType.id
					).then((dbManager) => {
						// Create manager powerPlants in database
						const powerPlant = manager.building;
						buildingResolver.create(
							powerPlant.battery.buffer,
							powerPlant.battery.capacity,
							coalPowerPlantType.id,
							dbManager.id
						).then((dbPowerPlant) => {
							// Create manager powerPlants generators in database
							const generators = powerPlant.generators.values();
							for (const generator of generators) {
								generatorResolver.create(
									generator.baseOutput,
									generator.isBroken,
									coalGeneratorType.id,
									dbPowerPlant.id
								);
							}
						});
					});
					break;
				default:
					break;
			}
		}
	});
}

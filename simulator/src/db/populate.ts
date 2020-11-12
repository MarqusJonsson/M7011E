import { userTypeResolver } from './resolvers/userType'
import { buildingTypeResolver } from './resolvers/buildingType'
import { generatorTypeResolver } from './resolvers/generatorType'
import { userResolver } from './resolvers/user'
import { buildingResolver } from './resolvers/building'
import { generatorResolver } from './resolvers/generator'
import { transactionResolver } from './resolvers/transaction'
import { Prosumer } from '../users/prosumer';
import { House } from '../buildings/house'
import { Battery } from '../buildings/components/battery'
import { GeoData } from '../buildings/components/geoData'
import { WindTurbine } from '../generators/windTurbine'
import { CoalPowerPlant } from '../buildings/coalPowerPlant'
import { CoalGenerator } from '../generators/coalGenerator'
import { Environment } from '../environment'
import { BaseUser } from '../users/baseUser'
import { BaseBuilding } from '../buildings/baseBuilding'
import { Manager } from '../users/manager'
import { GaussianDistribution } from '../math/gaussianDistribution'
import { BaseGenerator } from '../generators/baseGenerator'
{
	// Simulate an environment
	const environment: Environment = new Environment(Date.now());
	let users: BaseUser[] = [];
	const prosumerCurrencyDistribution: GaussianDistribution = new GaussianDistribution(20000, 1000);
	const houseBatteryDistribution: GaussianDistribution = new GaussianDistribution(200, 2);
	const houseConsumptionDistribution: GaussianDistribution = new GaussianDistribution(2283, 1000);
	const houseWindTurbineProductionDistribution: GaussianDistribution = new GaussianDistribution(1372, 300);
	// Create managers with power plants
	const nManagers = 10;
	for (let i = 0; i < nManagers; i++) {
		const powerPlant = new CoalPowerPlant(
			new Battery(1000000, 500000),
			new GeoData(),
			[ // List of owned generators
				new CoalGenerator(1000)
			],
			1000 // Consumption
		);
		const manager = new Manager(
			100000, // Currency
			[ // List of owned power plants
				powerPlant
			]
		);
		users.push(manager);
		// Create prosumers with houses that communicates with the most recently created manager
		const prosumersPerManager = 5;
		for (let i = 0; i < prosumersPerManager; i++) {
			const batteryCapacity = houseBatteryDistribution.sample();
			users.push(
				new Prosumer(
					prosumerCurrencyDistribution.sample(), // Currency
					[ // List of owned houses
						new House(
							new Battery(batteryCapacity, batteryCapacity * 0.5),
							new GeoData(),
							[ // List of generators
								new WindTurbine(houseWindTurbineProductionDistribution.sample())
							],
							houseConsumptionDistribution.sample(),
							powerPlant,
							0.5,
							manager
						)
					]
				)
			)
		}
	}
	populate(users);
}

function populate(users: BaseUser[]) {
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
						prosumer.type + '_' + prosumer.id,
						prosumer.currency,
						prosumerType.id
					).then((dbProsumer) => {
						// Create prosumer houses in database
						const houses = prosumer.houses;
						for (let j = 0; j < houses.length; j++) {
							const house = houses[j];
							buildingResolver.create(
								house.battery.buffer,
								house.battery.capacity,
								houseType.id,
								dbProsumer.id
							).then((dbHouse) => {
								// Create prosumer houses generators in database
								const generators = house.generators;
								for (let k = 0; k < generators.length; k++) {
									const generator = generators[k];
									generatorResolver.create(
										generator.baseOutput,
										generator.isBroken,
										windTurbineType.id,
										dbHouse.id
									);
								}
							});
						}
					});
					break;
				case Manager.name:
					const manager = <Manager> user;
					// Create manager users in database
					userResolver.create(
						manager.type + '_' + manager.id,
						manager.currency,
						managerType.id
					).then((dbManager) => {
						// Create manager powerPlants in database
						const powerPlants = manager.powerPlants;
						for (let j = 0; j < powerPlants.length; j++) {
							const powerPlant = powerPlants[j];
							buildingResolver.create(
								powerPlant.battery.buffer,
								powerPlant.battery.capacity,
								coalPowerPlantType.id,
								dbManager.id
							).then((dbPowerPlant) => {
								// Create manager powerPlants generators in database
								const generators = powerPlant.generators;
								for (let k = 0; k < generators.length; k++) {
									const generator = generators[k];
									generatorResolver.create(
										generator.baseOutput,
										generator.isBroken,
										coalGeneratorType.id,
										dbPowerPlant.id
									);
								}
							});
						}
					});
					break;
				default:
					break;
			}
		}
	});
}

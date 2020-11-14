import { BaseBuilding } from './buildings/baseBuilding';
import { BasePowerPlant } from './buildings/basePowerPlant';
import { CoalPowerPlant } from './buildings/coalPowerPlant';
import { Battery } from './buildings/components/battery';
import { GeoData } from './buildings/components/geoData';
import { House } from './buildings/house';
import { Environment } from './environment';
import { CoalGenerator } from './generators/coalGenerator';
import { WindTurbine } from './generators/windTurbine';
import { kWh_to_Ws } from './math/electricity';
import { GaussianDistribution } from './math/gaussianDistribution';
import { Simulator } from './simulator';
import { Manager } from './users/manager';
import { Prosumer } from './users/prosumer';
import {
	AVERAGE_POWER_PLANT_COAL_GENERATOR_ELECTRICITY_PRODUCTION_PER_SECOND,
	AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND,
	AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND,
	AVERAGE_HOUSE_BATTERY_CAPACITY
} from './utils/realLifeData';

// Simulate an environment
const environment: Environment = new Environment(Date.now());
const managers: Manager[] = [];
const powerPlants: BasePowerPlant[] = [];
const prosumers: Prosumer[] = [];
const houses: House[] = [];

// Create managers with one power plant each
const nManagers = 5;
for (let i = 0; i < nManagers; i++) {
	const battery = new Battery(kWh_to_Ws(1000000), kWh_to_Ws(500000));
	const geoData = new GeoData();
	const coalGenerator = new CoalGenerator(AVERAGE_POWER_PLANT_COAL_GENERATOR_ELECTRICITY_PRODUCTION_PER_SECOND);
	const consumption = 1000;
	const powerPlant = new CoalPowerPlant(battery, geoData, [coalGenerator], consumption);
	powerPlants.push(powerPlant);
	const managerCurrency = 100000;
	const manager = new Manager(managerCurrency, [powerPlant]);
	managers.push(manager);
}
// Setup distributions for prosumers
const prosumerCurrencyDistribution: GaussianDistribution =
	new GaussianDistribution(20000, 4000);
const houseBatteryDistribution: GaussianDistribution =
	new GaussianDistribution(
		AVERAGE_HOUSE_BATTERY_CAPACITY,
		AVERAGE_HOUSE_BATTERY_CAPACITY * 0.15
	);
const houseConsumptionDistribution: GaussianDistribution = 
	new GaussianDistribution(
		AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND,
		AVERAGE_HOUSE_ELECTRICITY_CONSUMPTION_PER_SECOND * 0.15
	);
const houseWindTurbineProductionDistribution: GaussianDistribution =
	new GaussianDistribution(
		AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND,
		AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND * 0.15
	);
// Create prosumers with one house each
const nProsumers = 50;
for (let i = 0; i < nProsumers; i++) {
	const currency = prosumerCurrencyDistribution.sample();
	const batteryCapacity = houseBatteryDistribution.sample();
	const batteryBufferStartPercent = 0.1;
	const battery = new Battery(batteryCapacity, batteryCapacity * batteryBufferStartPercent);
	const geoData = new GeoData();
	const windTurbine = new WindTurbine(houseWindTurbineProductionDistribution.sample());
	const consumption = houseConsumptionDistribution.sample();
	const batteryToPowerPlantStartRatio = 0.5;
	const house = new House(battery, geoData, [windTurbine], consumption, batteryToPowerPlantStartRatio, managers);
	houses.push(house);
	const prosumer = new Prosumer(currency, [house]);
	prosumers.push(prosumer);
}
const buildings: BaseBuilding[] = (<BaseBuilding[]><unknown> powerPlants).concat(<BaseBuilding[]><unknown> houses);
const samplingIntervalMiliSeconds = 100;
const fixedTimeStep = false;
const fixedDeltaTime = 1000 * 3600 * 24 * 1;
const simulator = new Simulator(environment, managers, prosumers, buildings, samplingIntervalMiliSeconds, fixedTimeStep, fixedDeltaTime);
simulator.run();
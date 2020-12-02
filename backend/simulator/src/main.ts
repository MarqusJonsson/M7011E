import { Server } from './server';
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
import { BaseUser } from './users/baseUser';
import { Manager } from './users/manager';
import { Prosumer } from './users/prosumer';
import {
	AVERAGE_POWER_PLANT_COAL_GENERATOR_ELECTRICITY_PRODUCTION_PER_SECOND,
	AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND,
	AVERAGE_HOUSE_BATTERY_CAPACITY,
	MONTH_MEAN_TEMPERATURES
} from './utils/realLifeData';
import { IMap } from './identifiable';
import { BaseGenerator } from './generators/baseGenerator';

// Simulate an environment
const environment: Environment = new Environment(Date.now());
const managers: IMap<Manager> = new IMap<Manager>();
const powerPlants: IMap<BasePowerPlant> = new IMap<BasePowerPlant>();
const prosumers: IMap<Prosumer> = new IMap<Prosumer>();
const houses: IMap<House> = new IMap<House>();

// Setup distributions for each month mean temperatures
const meanTempVariance = 10;
const janDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[0], meanTempVariance);
const febDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[1], meanTempVariance);
const marDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[2], meanTempVariance);
const aprilDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[3], meanTempVariance);
const mayDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[4], meanTempVariance);
const juneDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[5], meanTempVariance);
const juliDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[6], meanTempVariance);
const augDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[7], meanTempVariance);
const sepDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[8], meanTempVariance);
const octDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[9], meanTempVariance);
const novDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[10], meanTempVariance);
const decDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[11], meanTempVariance);

const monthMeanTemperatureDistributions: GaussianDistribution[] = [
	janDistribution, febDistribution, marDistribution, aprilDistribution, 
	mayDistribution, juneDistribution, juliDistribution, augDistribution,
	sepDistribution, octDistribution, novDistribution, decDistribution];
environment.monthMeanTemperatureDistributions = monthMeanTemperatureDistributions;

// Setup distributions for prosumers
const prosumerCurrencyDistribution: GaussianDistribution =
	new GaussianDistribution(20000, 4000);
const houseBatteryDistribution: GaussianDistribution =
	new GaussianDistribution(
		AVERAGE_HOUSE_BATTERY_CAPACITY,
		AVERAGE_HOUSE_BATTERY_CAPACITY * 0.15
	);
const houseWindTurbineProductionDistribution: GaussianDistribution =
	new GaussianDistribution(
		AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND,
		AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND * 0.15
	);
// Create prosumers with one house each
const nProsumers = 5;
for (let i = 0; i < nProsumers; i++) {
	const currency = prosumerCurrencyDistribution.sample();
	const batteryCapacity = houseBatteryDistribution.sample();
	const batteryBufferStartPercent = 0.0;
	const battery = new Battery(batteryCapacity, batteryCapacity * batteryBufferStartPercent);
	const geoData = new GeoData();
	const generators = new IMap<BaseGenerator>();
	const windTurbine = new WindTurbine(houseWindTurbineProductionDistribution.sample());
	generators.iSet(windTurbine);
	const batteryToPowerPlantStartRatio = 0.0;
	const house = new House(battery, geoData, generators, batteryToPowerPlantStartRatio);
	houses.iSet(house);
	const prosumer = new Prosumer(currency, house);
	prosumers.iSet(prosumer);
}
// Create managers with one power plant each
const nManagers = 5;
for (let i = 0; i < nManagers; i++) {
	const battery = new Battery(kWh_to_Ws(1000000), kWh_to_Ws(500000));
	const geoData = new GeoData();
	const coalGenerator = new CoalGenerator(AVERAGE_POWER_PLANT_COAL_GENERATOR_ELECTRICITY_PRODUCTION_PER_SECOND);
	const generators = new IMap<BaseGenerator>();
	generators.iSet(coalGenerator);
	const powerPlant = new CoalPowerPlant(battery, geoData, generators);
	powerPlants.iSet(powerPlant);
	const managerCurrency = 100000;
	const manager = new Manager(managerCurrency, powerPlant);
	managers.iSet(manager);
}
// Connect managers and prosumers
prosumers.forEach((prosumer) => {
	const houseGeoData = prosumer.house.geoData;
	const managersIterable: IterableIterator<Manager> = managers.values();
	let closestManager: Manager = managersIterable.next().value;
	let closestPowerPlantDistance: number = houseGeoData.distance(closestManager.powerPlant.geoData);
	for (const manager of managersIterable) {
		const distance = houseGeoData.distance(manager.powerPlant.geoData);
		if (distance < closestPowerPlantDistance) {
			closestManager = manager;
			closestPowerPlantDistance = distance;
		}
	};
	closestManager.prosumers.iSet(prosumer);
});
const users: BaseUser[] = [...managers.values(), ...prosumers.values()];
const samplingIntervalMiliSeconds = 100;
const fixedTimeStep = false;
const fixedDeltaTime = 1000 * 3600 * 24 * 1;
const simulator = new Simulator(environment, users, samplingIntervalMiliSeconds, fixedTimeStep, fixedDeltaTime);
new Server(simulator);
simulator.run();

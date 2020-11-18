import { Server } from './server';
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
	AVERAGE_HOUSE_BATTERY_CAPACITY,
	MONTH_MEAN_TEMPERATURES
} from './utils/realLifeData';

// Simulate an environment
const environment: Environment = new Environment(Date.now());
const managers: Manager[] = [];
const powerPlants: BasePowerPlant[] = [];
const prosumers: Prosumer[] = [];
const houses: House[] = [];

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

const monthMeanTemperatureDistributions: Array<GaussianDistribution> = [
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
const nProsumers = 1;
for (let i = 0; i < nProsumers; i++) {
	const currency = 40000;//prosumerCurrencyDistribution.sample();
	const batteryCapacity = houseBatteryDistribution.sample();
	const batteryBufferStartPercent = 0.0;
	const battery = new Battery(batteryCapacity, batteryCapacity * batteryBufferStartPercent);
	const geoData = new GeoData();
	const windTurbine = new WindTurbine(0);//houseWindTurbineProductionDistribution.sample());
	const batteryToPowerPlantStartRatio = 0.0;
	const house = new House(battery, geoData, [windTurbine], batteryToPowerPlantStartRatio);
	houses.push(house);
	const prosumer = new Prosumer(currency, house);
	prosumers.push(prosumer);
}
// Create managers with one power plant each
const nManagers = 1;
for (let i = 0; i < nManagers; i++) {
	const battery = new Battery(kWh_to_Ws(1000000), kWh_to_Ws(500000));
	const geoData = new GeoData();
	const coalGenerator = new CoalGenerator(AVERAGE_POWER_PLANT_COAL_GENERATOR_ELECTRICITY_PRODUCTION_PER_SECOND);
	const powerPlant = new CoalPowerPlant(battery, geoData, [coalGenerator]);
	powerPlants.push(powerPlant);
	const managerCurrency = 100000;
	const manager = new Manager(managerCurrency, powerPlant);
	managers.push(manager);
}
// Connect managers and prosumers
prosumers.forEach((prosumer) => {
	const houseGeoData = prosumer.house.geoData;
	let closestManager: Manager = managers[0];
	let closestPowerPlantDistance: number = houseGeoData.distance(managers[0].powerPlant.geoData);
	for (let i = 1; i < managers.length; i++) {
		const distance = houseGeoData.distance(managers[i].powerPlant.geoData);
		if (distance < closestPowerPlantDistance) {
			closestManager = managers[i];
			closestPowerPlantDistance = distance;
		}
	}
	closestManager.prosumers.push(prosumer);
});
const buildings: BaseBuilding[] = (<BaseBuilding[]><unknown> powerPlants).concat(<BaseBuilding[]><unknown> houses);
const samplingIntervalMiliSeconds = 100;
const fixedTimeStep = false;
const fixedDeltaTime = 1000 * 3600 * 24 * 1;
const simulator = new Simulator(environment, managers, prosumers, buildings, samplingIntervalMiliSeconds, fixedTimeStep, fixedDeltaTime);
new Server(simulator);
simulator.run();

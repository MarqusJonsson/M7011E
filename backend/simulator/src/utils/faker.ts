import { CoalPowerPlant } from "../buildings/coalPowerPlant";
import { Battery } from "../buildings/components/battery";
import { GeoData } from "../buildings/components/geoData";
import { House } from "../buildings/house";
import { CoalGenerator } from "../generators/coalGenerator";
import { WindTurbine } from "../generators/windTurbine";
import { kWh_to_Ws } from "../math/electricity";
import { GaussianDistribution } from "../math/gaussianDistribution";
import { Manager } from "../users/manager";
import { Prosumer } from "../users/prosumer";
import { AVERAGE_HOUSE_BATTERY_CAPACITY, AVERAGE_HOUSE_WIND_TURBINE_PRODUCTION_PER_SECOND, AVERAGE_POWER_PLANT_COAL_GENERATOR_ELECTRICITY_PRODUCTION_PER_SECOND } from "./realLifeData";

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

function createProsumer(id?: number) {
	const currency = prosumerCurrencyDistribution.sample();
	const batteryCapacity = houseBatteryDistribution.sample();
	const batteryBufferStartPercent = 0.5;
	const battery = new Battery(batteryCapacity, batteryCapacity * batteryBufferStartPercent);
	const geoData = new GeoData();
	const windTurbine = new WindTurbine(houseWindTurbineProductionDistribution.sample());
	const generators = [windTurbine];
	const batteryToPowerPlantStartRatio = 0.0;
	const house = new House(battery, geoData, generators, batteryToPowerPlantStartRatio);
	return new Prosumer(currency, house, id);
}

function createManager(id?: number) {
	const battery = new Battery(kWh_to_Ws(1000000), kWh_to_Ws(500000));
	const geoData = new GeoData();
	const coalGenerator = new CoalGenerator(AVERAGE_POWER_PLANT_COAL_GENERATOR_ELECTRICITY_PRODUCTION_PER_SECOND);
	const generators = [coalGenerator]
	const powerPlant = new CoalPowerPlant(battery, geoData, generators);
	const managerCurrency = 100000;
	return new Manager(managerCurrency, powerPlant, id);
}

export const faker = {
	createProsumer: createProsumer,
	createManager: createManager
};
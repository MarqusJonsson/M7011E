import { expect } from 'chai';
import { BaseBuilding } from "../src/buildings/baseBuilding";
import { House } from "../src/buildings/house";
import { Battery } from '../src/buildings/components/battery';
import { GeoData } from '../src/buildings/components/geoData';
import { BaseGenerator } from '../src/generators/baseGenerator';
import { CoalGenerator } from "../src/generators/coalGenerator";
import { CoalPowerPlant} from "../src/buildings/coalPowerPlant";
import { Prosumer } from '../src/users/prosumer';
import { Manager } from "../src/users/manager";
import { Environment } from '../src/environment';
import { BasePowerPlant } from "../src/buildings/basePowerPlant";

class TestObject{
	environment!: Environment;
	pBattery!: Battery;
	pGeoData!: GeoData;
	pGenerators!: BaseGenerator[];
	powerPlants!: BasePowerPlant[];
	manager!: Manager;
	coalpowerPlant!: CoalPowerPlant;
	prosumer!: Prosumer;
	hBattery!: Battery;
	hGenerators!: BaseGenerator[];
	hGeodata!: GeoData;
	house!: House;
	hCoalGenerator!: CoalGenerator;

	public defaultValues(testObject: any): void {
		testObject.environment = new Environment(0);
		testObject.pBattery = new Battery(1000, 0);
		testObject.pGeoData = new GeoData(100, 10, 10);
		testObject.pGenerators = [] as BaseGenerator[];
		testObject.powerPlants = [] as BasePowerPlant[];
		testObject.manager = new Manager(0, testObject.powerPlants);
		testObject.coalPowerPlant = new CoalPowerPlant(testObject.pBattery, testObject.pGeoData, testObject.pGenerators, 0, testObject.manager, testObject.environment);
		testObject.prosumer = new Prosumer();
		testObject.hBattery = new Battery(100, 0);
		testObject.hGenerators = [] as BaseGenerator[];
		testObject.hGeoData = new GeoData(10, 10, 10);
		testObject.house = new House(testObject.hBattery, testObject.hGeoData, testObject.hGenerators, 1, testObject.coalPowerPlant, testObject.prosumer, testObject.environment, 0.1);
		testObject.hCoalGenerator = new CoalGenerator(100, false, testObject.house, 0);
		testObject.house.generators.push(testObject.hCoalGenerator);
	}
}

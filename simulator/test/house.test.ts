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
	coalPowerPlant!: CoalPowerPlant;
	prosumer!: Prosumer;
	hBattery!: Battery;
	hGenerators!: BaseGenerator[];
	hGeoData!: GeoData;
	house!: House;
	hCoalGenerator!: CoalGenerator;

	public defaultValues(): void {
		this.environment = new Environment(0);
		this.pBattery = new Battery(2000, 0);
		this.pGeoData = new GeoData(100, 10, 10);
		this.pGenerators = [] as BaseGenerator[];
		this.powerPlants = [] as BasePowerPlant[];
		this.manager = new Manager(0, this.powerPlants);
		this.coalPowerPlant = new CoalPowerPlant(this.pBattery, this.pGeoData, this.pGenerators, 0, this.manager, this.environment);
		this.prosumer = new Prosumer();
		this.hBattery = new Battery(100, 0);
		this.hGenerators = [] as BaseGenerator[];
		this.hGeoData = new GeoData(10, 10, 10);
		this.house = new House(this.hBattery, this.hGeoData, this.hGenerators, 1, this.coalPowerPlant, this.prosumer, this.environment, 0.1);
		this.hCoalGenerator = new CoalGenerator(100, false, this.house, 0);
		this.house.generators.push(this.hCoalGenerator);
	}
}

describe('house.ts', function(){
	let testObject = new TestObject;
	
	describe('#generateElectricity()', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Generate 10 electricity units to battery.', function() {
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(1);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Generate 90 electricity units to power plant.', function() {
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(1);
			expect(testObject.house.powerPlantParent.battery.buffer).to.equal(90);

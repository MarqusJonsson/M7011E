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
		this.house = new House(this.hBattery, this.hGeoData, this.hGenerators, 40, this.coalPowerPlant, this.prosumer, this.environment, 0.1);
		this.hCoalGenerator = new CoalGenerator(100, false, this.house, 0);
		this.house.generators.push(this.hCoalGenerator);
	}
}

describe('baseBuilding.ts', function() {
	let testObject = new TestObject;
	describe('#consumeElectricity', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Consume insufficient energy and blackout.', function() {
			testObject.house.battery.buffer = 20;
			testObject.house.consumeElectricity(1);
			expect(testObject.house.hasBlackout).to.equal(true);
			expect(testObject.house.battery.buffer).to.equal(0);
		});
		it('Consume energy up to demand.', function() {
			testObject.hBattery.buffer = 50;
			testObject.house.consumeElectricity(1);
			expect(testObject.house.hasBlackout).to.equal(false);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Consume energy up to demand and return from blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.hBattery.buffer = 50;
			testObject.house.consumeElectricity(1);
			expect(testObject.house.hasBlackout).to.equal(false);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Consume nothing due to not reaching demand and do not return from blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.hBattery.buffer = 20;
			testObject.house.consumeElectricity(1);
			expect(testObject.house.hasBlackout).to.equal(true);
			expect(testObject.house.battery.buffer).to.equal(20);
		});
	});
});
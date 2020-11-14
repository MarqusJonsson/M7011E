import { expect } from 'chai';
import { House } from '../../src/buildings/house';
import { Battery } from '../../src/buildings/components/battery';
import { GeoData } from '../../src/buildings/components/geoData';
import { CoalGenerator } from '../../src/generators/coalGenerator';
import { CoalPowerPlant} from '../../src/buildings/coalPowerPlant';
import { Manager } from '../../src/users/manager';
import { Environment } from '../../src/environment';

class TestObject{
	environment!: Environment;
	pBattery!: Battery;
	pGeoData!: GeoData;
	manager!: Manager;
	coalPowerPlant!: CoalPowerPlant;
	hBattery!: Battery;
	hGeoData!: GeoData;
	hCoalGenerator!: CoalGenerator;
	house!: House;

	public defaultValues(): void {
		this.environment = new Environment(0);
		this.pBattery = new Battery(2000, 0);
		this.pGeoData = new GeoData(100, 10, 10);
		this.coalPowerPlant = new CoalPowerPlant(this.pBattery, this.pGeoData, [], 0);
		this.manager = new Manager(0, [this.coalPowerPlant]);
		
		this.hBattery = new Battery(100, 0);
		this.hGeoData = new GeoData(10, 10, 10);
		this.hCoalGenerator = new CoalGenerator(100, false, 0);
		this.house = new House(this.hBattery, this.hGeoData, [this.hCoalGenerator], 40, 0.1, [this.manager]);
	}
}

describe('buildings/baseBuilding.ts', function() {
	let testObject = new TestObject;
	describe('#consumeElectricity', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Consume insufficient energy and blackout.', function() {
			testObject.house.battery.buffer = 20;
			testObject.house.consumeElectricity(1, testObject.environment);
			expect(testObject.house.hasBlackout).to.equal(true);
			expect(testObject.house.battery.buffer).to.equal(0);
		});
		it('Consume energy up to demand.', function() {
			testObject.hBattery.buffer = 50;
			testObject.house.consumeElectricity(1, testObject.environment);
			expect(testObject.house.hasBlackout).to.equal(false);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Consume energy up to demand and return from blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.hBattery.buffer = 50;
			testObject.house.consumeElectricity(1, testObject.environment);
			expect(testObject.house.hasBlackout).to.equal(false);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Consume nothing due to not reaching demand and do not return from blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.hBattery.buffer = 20;
			testObject.house.consumeElectricity(1, testObject.environment);
			expect(testObject.house.hasBlackout).to.equal(true);
			expect(testObject.house.battery.buffer).to.equal(20);
		});
	});
});

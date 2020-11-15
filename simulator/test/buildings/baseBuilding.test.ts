import { expect } from 'chai';
import { House } from '../../src/buildings/house';
import { Battery } from '../../src/buildings/components/battery';
import { GeoData } from '../../src/buildings/components/geoData';
import { CoalGenerator } from '../../src/generators/coalGenerator';
import { CoalPowerPlant} from '../../src/buildings/coalPowerPlant';
import { Manager } from '../../src/users/manager';
import { Environment } from '../../src/environment';

class TestObject{
	hBattery!: Battery;
	house!: House;

	public defaultValues(): void {
		const pBattery = new Battery(2000, 0);
		const pGeoData = new GeoData(100, 10, 10);
		const coalPowerPlant = new CoalPowerPlant(pBattery, pGeoData, []);
		const manager = new Manager(0, coalPowerPlant);
		
		this.hBattery = new Battery(100, 0);
		const hGeoData = new GeoData(10, 10, 10);
		const hCoalGenerator = new CoalGenerator(100, false, 0);
		this.house = new House(this.hBattery, hGeoData, [hCoalGenerator], 0.1);
	}
}

describe('buildings/baseBuilding.ts', function() {
	let testObject = new TestObject;
	describe('#consumeElectricity', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Consume insufficient energy and blackout.', function() {
			testObject.house.battery.buffer = 20;
			testObject.house.consumption = 40;
			testObject.house.consumeElectricity();
			expect(testObject.house.hasBlackout).to.equal(true);
			expect(testObject.house.battery.buffer).to.equal(0);
		});
		it('Consume energy up to demand.', function() {
			testObject.hBattery.buffer = 50;
			testObject.house.consumption = 40;
			testObject.house.consumeElectricity();
			expect(testObject.house.hasBlackout).to.equal(false);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Consume energy up to demand and return from blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.hBattery.buffer = 50;
			testObject.house.consumption = 40;
			testObject.house.consumeElectricity();
			expect(testObject.house.hasBlackout).to.equal(false);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Consume nothing due to not reaching demand and do not return from blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.hBattery.buffer = 20;
			testObject.house.consumption = 30;
			testObject.house.consumeElectricity();
			expect(testObject.house.hasBlackout).to.equal(true);
			expect(testObject.house.battery.buffer).to.equal(20);
		});
	});
});

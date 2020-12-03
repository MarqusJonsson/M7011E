import { expect } from 'chai';
import { House } from '../../src/buildings/house';
import { Battery } from '../../src/buildings/components/battery';
import { GeoData } from '../../src/buildings/components/geoData';
import { CoalGenerator } from '../../src/generators/coalGenerator';

class TestObject {
	hBattery!: Battery;
	house!: House;

	public defaultValues(): void {
		this.hBattery = new Battery(100, 0);
		const hGeoData = new GeoData();
		const hCoalGenerator = new CoalGenerator(100, false, 0);
		const hGenerators = [hCoalGenerator]
		this.house = new House(this.hBattery, hGeoData, hGenerators, 0.1);
	}
}

describe('buildings/baseBuilding.ts', function() {
	let testObject = new TestObject;
	describe('#consumeElectricity', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Consume insufficient energy and blackout.', function() {
			testObject.house.battery.buffer = 20;
			testObject.house.electricityConsumption = 40;
			testObject.house.consumeElectricity();
			expect(testObject.house.hasBlackout).to.equal(true);
			expect(testObject.house.battery.buffer).to.equal(0);
		});
		it('Consume energy up to demand.', function() {
			testObject.hBattery.buffer = 50;
			testObject.house.electricityConsumption = 40;
			testObject.house.consumeElectricity();
			expect(testObject.house.hasBlackout).to.equal(false);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Consume energy up to demand and return from blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.hBattery.buffer = 50;
			testObject.house.electricityConsumption = 40;
			testObject.house.consumeElectricity();
			expect(testObject.house.hasBlackout).to.equal(false);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Consume nothing due to not reaching demand and do not return from blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.hBattery.buffer = 20;
			testObject.house.electricityConsumption = 30;
			testObject.house.consumeElectricity();
			expect(testObject.house.hasBlackout).to.equal(true);
			expect(testObject.house.battery.buffer).to.equal(20);
		});
	});
});

import { expect } from 'chai';
import { House } from '../../src/buildings/house';
import { Battery } from '../../src/buildings/components/battery';
import { GeoData } from '../../src/buildings/components/geoData';
import { CoalGenerator } from '../../src/generators/coalGenerator';
import { IMap } from '../../src/identifiable';
import { BaseGenerator } from '../../src/generators/baseGenerator';

class TestObject {
	pBattery!: Battery;
	hBattery!: Battery;
	house!: House;

	public defaultValues(): void {
		this.pBattery = new Battery(2000, 0);
		
		this.hBattery = new Battery(100, 0);
		const hGeoData = new GeoData();
		const hCoalGenerator = new CoalGenerator(100, false, 0);
		const hGenerators = new IMap<BaseGenerator>();
		hGenerators.iSet(hCoalGenerator);
		this.house = new House(this.hBattery, hGeoData, hGenerators, 0.1);
	}
}

describe('buildings/house.ts', function(){
	let testObject = new TestObject;
	
	describe('#generateElectricity()', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Generate 10 electricity units to battery.', function() {
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(testObject.pBattery);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Generate 90 electricity units to power plant.', function() {
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(testObject.pBattery);
			expect(testObject.house.electricityOutput).to.equal(90);
		});
		it('Should not generate electricity because of blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(testObject.pBattery);
			expect(testObject.house.battery.buffer).to.equal(0);

		});
		it('Generate over house battery capacity and send remainder to power plant.', function() {
			testObject.house.generators.values().next().value().baseOutput = 2000;
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(testObject.pBattery);
			expect(testObject.house.battery.buffer).to.equal(100);
			expect(testObject.house.electricityOutput).to.equal(1900);
		});
		it('Generate over house battery capacity and power plant capacity.', function() {
			testObject.pBattery.capacity = 1000;
			testObject.house.generators.values().next().value().baseOutput = 2000;
			testObject.house.batteryToPowerPlantRatio = 0.6;
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(testObject.pBattery);
			expect(testObject.house.electricityOutput).to.equal(1000);

		});
		it('Generate under house battery capacity but over power plant battery capacity.', function() {
			testObject.pBattery.capacity = 10;
			testObject.house.generators.values().next().value().baseOutput = 50;
			testObject.house.batteryToPowerPlantRatio = 0.6;
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(testObject.pBattery);
			expect(testObject.hBattery.buffer).to.equal(40);
		});
	});
});
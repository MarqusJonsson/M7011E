import { expect } from 'chai';
import { House } from '../../src/buildings/house';
import { Prosumer } from '../../src/users/prosumer';
import { CoalGenerator } from '../../src/generators/coalGenerator';
import { GeoData } from '../../src/buildings/components/geoData';
import { Battery } from '../../src/buildings/components/battery';
import { Manager } from '../../src/users/manager';
import { CoalPowerPlant } from '../../src/buildings/coalPowerPlant';
import { IMap } from '../../src/identifiable';
import { BaseGenerator } from '../../src/generators/baseGenerator';


class TestObject {
	pBattery!: Battery;
	manager!: Manager;
	coalPowerPlant!: CoalPowerPlant;
	prosumer!: Prosumer;
	hBattery!: Battery;
	house!: House;

	public defaultValues(): void {
		this.pBattery = new Battery(1000, 0);
		const pGeoData = new GeoData();
		this.coalPowerPlant = new CoalPowerPlant(this.pBattery, pGeoData, new IMap<BaseGenerator>());
		this.manager = new Manager(0, this.coalPowerPlant);
		
		this.hBattery = new Battery(1000, 0);
		const hCoalGenerator = new CoalGenerator(100, false, 0);
		const hGenerators = new IMap<BaseGenerator>();
		hGenerators.iSet(hCoalGenerator);
		const hGeoData = new GeoData();
		this.house = new House(this.hBattery, hGeoData, hGenerators, 1);
		this.prosumer = new Prosumer(0, this.house);
	}
}

describe('users/prosumer.ts', function() {
	let testObject = new TestObject;
	describe('#buyElectricity()', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Buy 200 electricity units for 2000 currency units.', function() {
			testObject.pBattery.buffer = 500;
			testObject.coalPowerPlant.electricityBuyPrice = 10;
			testObject.house.electricityConsumption = 300;
			testObject.house.calculateProduction(1);
			testObject.prosumer.currency = 2000;
			testObject.prosumer.buyElectricity(testObject.manager);
			expect(testObject.prosumer.currency).to.equal(0);
			expect(testObject.hBattery.buffer).to.equal(200);
		});
		it('Buy all available electricity in power plant battery.', function() {
			testObject.pBattery.buffer = 100;
			testObject.coalPowerPlant.electricityBuyPrice = 10;
			testObject.house.electricityConsumption = 300;
			testObject.house.calculateProduction(1);
			testObject.prosumer.currency = 2000;
			testObject.prosumer.buyElectricity(testObject.manager);
			expect(testObject.prosumer.currency).to.equal(1000);
			expect(testObject.hBattery.buffer).to.equal(100);
			expect(testObject.pBattery.buffer).to.equal(0);
		});
		it('Buy electricity with currency that is available.', function() {
			testObject.pBattery.buffer = 500;
			testObject.coalPowerPlant.electricityBuyPrice = 10;
			testObject.house.electricityConsumption = 500;
			testObject.house.calculateProduction(1);
			testObject.prosumer.currency = 500;
			testObject.prosumer.buyElectricity(testObject.manager);
			expect(testObject.prosumer.currency).to.equal(0);
			expect(testObject.hBattery.buffer).to.equal(50);
			expect(testObject.pBattery.buffer).to.equal(450);
		});
		it('Buy all available electricity in power plant battery with currency that is available.', function() {
			testObject.pBattery.buffer = 38;
			testObject.coalPowerPlant.electricityBuyPrice = 10;
			testObject.house.electricityConsumption = 500;
			testObject.house.calculateProduction(1);
			testObject.prosumer.currency = 390;
			testObject.prosumer.buyElectricity(testObject.manager);
			expect(testObject.prosumer.currency).to.equal(10);
			expect(testObject.hBattery.buffer).to.equal(38);
			expect(testObject.pBattery.buffer).to.equal(0);
		});
	});
});
 
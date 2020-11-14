import { expect } from 'chai';
import { House } from '../../src/buildings/house';
import { Prosumer } from '../../src/users/prosumer';
import { CoalGenerator } from '../../src/generators/coalGenerator';
import { BaseGenerator } from '../../src/generators/baseGenerator';
import { GeoData } from '../../src/buildings/components/geoData';
import { Battery } from '../../src/buildings/components/battery';
import { Environment } from '../../src/environment';
import { BasePowerPlant } from '../../src/buildings/basePowerPlant';
import { Manager } from '../../src/users/manager';
import { CoalPowerPlant } from '../../src/buildings/coalPowerPlant';


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

	public defaultValues(): void{
		this.environment = new Environment(0);
		this.pBattery = new Battery(1000, 0);
		this.pGeoData = new GeoData(100, 10, 10);
		this.coalPowerPlant = new CoalPowerPlant(this.pBattery, this.pGeoData, [], 0);
		this.manager = new Manager(0, [this.coalPowerPlant]);
		this.prosumer = new Prosumer();
		this.hBattery = new Battery(1000, 0);
		this.hGenerators = [] as BaseGenerator[];
		this.hGeoData = new GeoData(10, 10, 10);
		this.house = new House(this.hBattery, this.hGeoData, this.hGenerators, 1, 0.1, [this.manager]);
		this.hCoalGenerator = new CoalGenerator(100, false, 0);
		this.house.generators.push(this.hCoalGenerator);
		this.prosumer.houses.push(this.house);
	}
}

describe('prosumer.ts', function() {
	let testObject = new TestObject;
	describe('#buyElectricity()', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Buy 200 electricity units for 2000 currency units.', function() {
			testObject.pBattery.buffer = 500;
			testObject.coalPowerPlant.electricityBuyPrice = 10;
			testObject.house.consumption = 300;
			testObject.house.calculateProduction(1, testObject.environment);
			testObject.prosumer.currency = 2000;
			testObject.prosumer.buyElectricity(1);
			expect(testObject.prosumer.currency).to.equal(0);
			expect(testObject.hBattery.buffer).to.equal(200);
		});
		it('Buy all available electricity in power plant battery.', function() {
			testObject.pBattery.buffer = 100;
			testObject.coalPowerPlant.electricityBuyPrice = 10;
			testObject.house.consumption = 300;
			testObject.house.calculateProduction(1, testObject.environment);
			testObject.prosumer.currency = 2000;
			testObject.prosumer.buyElectricity(1);
			expect(testObject.prosumer.currency).to.equal(1000);
			expect(testObject.hBattery.buffer).to.equal(100);
			expect(testObject.pBattery.buffer).to.equal(0);
		});
		it('Buy electricity with currency that is available.', function() {
			testObject.pBattery.buffer = 500;
			testObject.coalPowerPlant.electricityBuyPrice = 10;
			testObject.house.consumption = 500;
			testObject.house.calculateProduction(1, testObject.environment);
			testObject.prosumer.currency = 500;
			testObject.prosumer.buyElectricity(1);
			expect(testObject.prosumer.currency).to.equal(0);
			expect(testObject.hBattery.buffer).to.equal(50);
			expect(testObject.pBattery.buffer).to.equal(450);
		});
		it('Buy all available electricity in power plant battery with currency that is available.', function() {
			testObject.pBattery.buffer = 38;
			testObject.coalPowerPlant.electricityBuyPrice = 10;
			testObject.house.consumption = 500;
			testObject.house.calculateProduction(1, testObject.environment);
			testObject.prosumer.currency = 390;
			testObject.prosumer.buyElectricity(1);
			expect(testObject.prosumer.currency).to.equal(10);
			expect(testObject.hBattery.buffer).to.equal(38);
			expect(testObject.pBattery.buffer).to.equal(0);
		});
	});
});
 
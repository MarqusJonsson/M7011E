import { expect } from 'chai';
import { BaseBuilding } from "../../src/buildings/baseBuilding";
import { House } from "../../src/buildings/house";
import { Battery } from '../../src/buildings/components/battery';
import { GeoData } from '../../src/buildings/components/geoData';
import { BaseGenerator } from '../../src/generators/baseGenerator';
import { CoalGenerator } from "../../src/generators/coalGenerator";
import { CoalPowerPlant} from "../../src/buildings/coalPowerPlant";
import { Prosumer } from '../../src/users/prosumer';
import { Manager } from "../../src/users/manager";
import { Environment } from '../../src/environment';
import { BasePowerPlant } from "../../src/buildings/basePowerPlant";

class TestObject{
	environment!: Environment;
	pBattery!: Battery;
	pGeoData!: GeoData;
	coalPowerPlant!: CoalPowerPlant;
	manager!: Manager;
	hBattery!: Battery;
	hGeoData!: GeoData;
	house!: House;
	hCoalGenerator!: CoalGenerator;

	public defaultValues(): void {
		this.pBattery = new Battery(2000, 0);
		this.pGeoData = new GeoData(100, 10, 10);
		this.coalPowerPlant = new CoalPowerPlant(this.pBattery, this.pGeoData, [], 0);
		this.manager = new Manager(0);

		this.hBattery = new Battery(100, 0);
		this.hGeoData = new GeoData(10, 10, 10);
		this.hCoalGenerator = new CoalGenerator(100, false, 0);
		this.house = new House(this.hBattery, this.hGeoData, [this.hCoalGenerator], 1, this.coalPowerPlant, 0.1, this.manager);
	}
}

describe('house.ts', function(){
	let testObject = new TestObject;
	
	describe('#generateElectricity()', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Generate 10 electricity units to battery.', function() {
			testObject.house.calculateProduction(1, testObject.environment, testObject.hGeoData);
			testObject.house.generateElectricity(1);
			expect(testObject.house.battery.buffer).to.equal(10);
		});
		it('Generate 90 electricity units to power plant.', function() {
			testObject.house.calculateProduction(1, testObject.environment, testObject.hGeoData);
			testObject.house.generateElectricity(1);
			expect(testObject.house.electricityOutput).to.equal(90);
		});
		it('Should not generate electricity because of blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.house.calculateProduction(1, testObject.environment, testObject.hGeoData);
			testObject.house.generateElectricity(1);
			expect(testObject.house.battery.buffer).to.equal(0);

		});
		it('Generate over house battery capacity and send remainder to power plant.', function() {
			testObject.house.generators[0].baseOutput = 2000;
			testObject.house.calculateProduction(1, testObject.environment, testObject.hGeoData);
			testObject.house.generateElectricity(1);
			expect(testObject.house.battery.buffer).to.equal(100);
			expect(testObject.house.electricityOutput).to.equal(1900);
		});
		it('Generate over house battery capacity and power plant capacity.', function() {
			testObject.pBattery.capacity = 1000;
			testObject.house.generators[0].baseOutput = 2000;
			testObject.house.batteryToPowerPlantRatio = 0.6;
			testObject.house.calculateProduction(1, testObject.environment, testObject.hGeoData);
			testObject.house.generateElectricity(1);
			expect(testObject.house.electricityOutput).to.equal(1000);

		});
		it('Generate under house battery capacity but over power plant battery capacity.', function() {
			testObject.pBattery.capacity = 10;
			testObject.house.generators[0].baseOutput = 50;
			testObject.house.batteryToPowerPlantRatio = 0.6;
			testObject.house.calculateProduction(1, testObject.environment, testObject.hGeoData);
			testObject.house.generateElectricity(1);
			expect(testObject.hBattery.buffer).to.equal(40);
		});
	});
});


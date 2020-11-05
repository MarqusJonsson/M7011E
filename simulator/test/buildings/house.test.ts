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
		});
		it('Should not generate electricity because of blackout.', function() {
			testObject.house.hasBlackout = true;
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(1);
			expect(testObject.house.battery.buffer).to.equal(0);

		});
		it('Generate over house battery capacity and send remainder to power plant.', function() {
			testObject.house.generators[0].baseOutput = 2000;
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(1);
			expect(testObject.house.battery.buffer).to.equal(100);
			expect(testObject.pBattery.buffer).to.equal(1900);
		});
		it('Generate over house battery capacity and power plant capacity.', function() {
			testObject.pBattery.capacity = 1000;
			testObject.house.generators[0].baseOutput = 2000;
			testObject.house.batteryToPowerPlantRatio = 0.6;
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(1);
			expect(testObject.pBattery.buffer).to.equal(1000);

		});
		it('Generate under house battery capacity but over power plant battery capacity. ', function() {
			testObject.pBattery.capacity = 10;
			testObject.house.generators[0].baseOutput = 50;
			testObject.house.batteryToPowerPlantRatio = 0.6;
			testObject.house.calculateProduction(1);
			testObject.house.generateElectricity(1);
			expect(testObject.hBattery.buffer).to.equal(40);
		});
	});
});


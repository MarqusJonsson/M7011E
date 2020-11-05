import { Battery } from "../../src/buildings/components/battery";
import { GeoData } from "../../src/buildings//components/geoData";
import { BaseGenerator } from "../../src/generators/baseGenerator";
import { CoalGenerator } from "../../src/generators/coalGenerator";
import { BasePowerPlant } from "../../src/buildings/basePowerPlant";
import { CoalPowerPlant } from "../../src/buildings/coalPowerPlant"
import { Manager } from "../../src/users/manager";
import { Environment } from "../../src/environment";
import { expect } from "chai";

class TestObject{
	environment!: Environment;
	pBattery!: Battery;
	pGeoData!: GeoData;
	pGenerators!: BaseGenerator[];
	pConsumption!: number;
	powerPlants!: BasePowerPlant[];
	manager!: Manager;
	coalPowerPlant!: CoalPowerPlant;
	pCoalGenerator!: CoalGenerator;

	public defaultValues(): void {
		this.environment = new Environment(0);
		this.pBattery = new Battery(2000, 0);
		this.pGeoData = new GeoData(100, 10, 10);
		this.pGenerators = [] as BaseGenerator[];
		this.pConsumption = 100;
		this.powerPlants = [] as BasePowerPlant[];
		this.manager = new Manager(0, this.powerPlants);
		this.coalPowerPlant = new CoalPowerPlant(this.pBattery, this.pGeoData, this.pGenerators, this.pConsumption, this.manager, this.environment);
		this.pCoalGenerator = new CoalGenerator(100, false, this.coalPowerPlant, 0);
		this.coalPowerPlant.generators.push(this.pCoalGenerator);
	}
}

describe('basePowerPlant.ts', function() {
	let testObject = new TestObject();
	describe('#generateElectricity', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Generate electricity and add it to battery.', function() {
			testObject.coalPowerPlant.calculateProduction(1);
			testObject.coalPowerPlant.generateElectricity(1);
			expect(testObject.coalPowerPlant.battery.buffer).to.equal(100);
		});
		it('Generate electricity, reach upper production limit and stop production.', function() {
			testObject.pCoalGenerator.baseOutput = 1201;
			testObject.coalPowerPlant.calculateProduction(1);
			testObject.coalPowerPlant.generateElectricity(1);
			expect(testObject.coalPowerPlant.battery.buffer).to.equal(1201);
			expect(testObject.coalPowerPlant.productionFlag).to.equal(false);
		});
		it('Generate electricity, reach upper production limit and stop production.', function() {
			testObject.pCoalGenerator.baseOutput = 1201;
			testObject.coalPowerPlant.calculateProduction(1);
			testObject.coalPowerPlant.generateElectricity(1);
			expect(testObject.coalPowerPlant.battery.buffer).to.equal(1201);
			expect(testObject.coalPowerPlant.productionFlag).to.equal(false);
		});
		it('Reach lower production limit and start production but do not generate electricity.', function() {
			testObject.coalPowerPlant.productionFlag = false;
			testObject.pCoalGenerator.baseOutput = 400;
			testObject.coalPowerPlant.calculateProduction(1);
			testObject.coalPowerPlant.generateElectricity(1);
			expect(testObject.coalPowerPlant.battery.buffer).to.equal(0);
			expect(testObject.coalPowerPlant.productionFlag).to.equal(true);
		});
		it('Generate electricity, go over battery capacity and stop production.', function() {
			testObject.pCoalGenerator.baseOutput = 2001;
			testObject.coalPowerPlant.calculateProduction(1);
			testObject.coalPowerPlant.generateElectricity(1);
			expect(testObject.coalPowerPlant.battery.buffer).to.equal(2000);
			expect(testObject.coalPowerPlant.productionFlag).to.equal(false);
		});
	});
});
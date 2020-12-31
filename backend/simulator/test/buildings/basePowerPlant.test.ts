import { Battery } from '../../src/buildings/components/battery';
import { GeoData } from '../../src/buildings//components/geoData';
import { CoalGenerator } from '../../src/generators/coalGenerator';
import { CoalPowerPlant } from '../../src/buildings/coalPowerPlant';
import { expect } from 'chai';

class TestObject {
	coalPowerPlant!: CoalPowerPlant;
	pCoalGenerator!: CoalGenerator;

	public defaultValues(): void {
		const pBattery = new Battery(2000, 0);
		const pGeoData = new GeoData();
		this.pCoalGenerator = new CoalGenerator(100, false, 0);
		const pGenerators = [this.pCoalGenerator];
		this.coalPowerPlant = new CoalPowerPlant(pBattery, pGeoData, pGenerators);
	}
}

describe('buildings/basePowerPlant.ts', function() {
	let testObject = new TestObject();
	describe('#generateElectricity', function() {
		beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
		it('Generate electricity and add it to battery.', function() {
			testObject.coalPowerPlant.calculateProduction(1);
			testObject.coalPowerPlant.generateElectricity();
			expect(testObject.coalPowerPlant.battery.buffer).to.equal(100);
		});
	});
});

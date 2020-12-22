import { expect } from 'chai';
import { Environment } from '../src/environment';
import { IMap } from '../src/identifiable';
import { Simulator } from '../src/simulator';
import { Manager } from '../src/users/manager';
import { Prosumer } from '../src/users/prosumer';
import { faker } from '../src/utils/faker';

class TestObject {
	simulator!: Simulator;

	public defaultValues(): void {
		const environment = new Environment(0);
		const users = new IMap<Manager | Prosumer>(); 
		this.simulator = new Simulator(environment, users, 500);
	}
}

describe('simulator.ts', function() {
	let testObject = new TestObject;
	beforeEach('Setup default values for test object.', function() {testObject.defaultValues()});
	describe('#addProsumer()', function() {
		it('Added prosumer gets added', function() {
			const prosumer = faker.createProsumer();
			testObject.simulator.addProsumer(prosumer);
			testObject.simulator.run(1);
			expect(testObject.simulator.prosumers.size).to.equal(1);
		});
	});
	describe('#removeProsumer()', function() {
		it('Removed prosumer gets removed', function() {
			const prosumer = faker.createProsumer();
			testObject.simulator.addProsumer(prosumer);
			testObject.simulator.run(1);
			testObject.simulator.removeProsumer(prosumer.identifier);
			testObject.simulator.run(1);
			expect(testObject.simulator.prosumers.size).to.equal(0);
		});
	});
	describe('#addManager()', function() {
		it('Added manager gets added', function() {
			const manager = faker.createManager();
			testObject.simulator.addManager(manager);
			testObject.simulator.run(1);
			expect(testObject.simulator.managers.size).to.equal(1);
		});
	});
	describe('#removeManager()', function() {
		it('Removed manager gets removed', function() {
			const manager = faker.createManager();
			testObject.simulator.addManager(manager);
			testObject.simulator.run(1);
			testObject.simulator.removeManager(manager.identifier);
			testObject.simulator.run(1);
			expect(testObject.simulator.managers.size).to.equal(0);
		});
	});
});

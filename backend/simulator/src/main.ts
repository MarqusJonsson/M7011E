
import { Environment } from './environment';
import { Simulator } from './simulator';
import { Manager } from './users/manager';
import { Prosumer } from './users/prosumer';
import { IMap } from './identifiable';
import { faker } from './utils/faker';
import { Server } from './server';

// Simulate an environment
const environment: Environment = new Environment(Date.now());

const users: IMap<Manager | Prosumer> = new IMap<Manager | Prosumer>();
// Create prosumers with one house each
const nProsumers = 0;
let prosumers = [] as Prosumer[];
for (let i = 0; i < nProsumers; i++) {
	const prosumer = faker.createProsumer();
	users.iSet(prosumer);
	prosumers.push(prosumer)
}
// Create managers with one power plant each
const nManagers = 0;
for (let i = 0; i < nManagers; i++) {
	users.iSet(faker.createManager());
}
const samplingIntervalMiliSeconds = 1000;
const fixedTimeStep = false;
const fixedDeltaTime = 1 * 60 * 60 * 1000;
const simulator = new Simulator(environment, users, samplingIntervalMiliSeconds, fixedTimeStep, fixedDeltaTime);
simulator.connectProsumersToManager(prosumers);
new Server(simulator);
simulator.run();

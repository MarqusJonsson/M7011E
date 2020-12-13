
import { Environment } from './environment';
import { GaussianDistribution } from './math/gaussianDistribution';
import { Simulator } from './simulator';
import { Manager } from './users/manager';
import { Prosumer } from './users/prosumer';
import { MONTH_MEAN_TEMPERATURES } from './utils/realLifeData';
import { IMap } from './identifiable';
import { faker } from './utils/faker';
import { Server } from './server';

// Simulate an environment
const environment: Environment = new Environment(Date.now());

// Setup distributions for each month mean temperatures
const meanTempVariance = 10;
const janDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[0], meanTempVariance);
const febDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[1], meanTempVariance);
const marDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[2], meanTempVariance);
const aprilDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[3], meanTempVariance);
const mayDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[4], meanTempVariance);
const juneDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[5], meanTempVariance);
const juliDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[6], meanTempVariance);
const augDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[7], meanTempVariance);
const sepDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[8], meanTempVariance);
const octDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[9], meanTempVariance);
const novDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[10], meanTempVariance);
const decDistribution: GaussianDistribution = new GaussianDistribution(MONTH_MEAN_TEMPERATURES[11], meanTempVariance);

const monthMeanTemperatureDistributions: GaussianDistribution[] = [
	janDistribution, febDistribution, marDistribution, aprilDistribution, 
	mayDistribution, juneDistribution, juliDistribution, augDistribution,
	sepDistribution, octDistribution, novDistribution, decDistribution];
environment.monthMeanTemperatureDistributions = monthMeanTemperatureDistributions;

const users: IMap<Manager | Prosumer> = new IMap<Manager | Prosumer>();
// Create prosumers with one house each
const nProsumers = 0;
for (let i = 0; i < nProsumers; i++) {
	users.iSet(faker.createProsumer());
}
// Create managers with one power plant each
const nManagers = 1;
for (let i = 0; i < nManagers; i++) {
	users.iSet(faker.createManager());
}
const samplingIntervalMiliSeconds = 1000;
const fixedTimeStep = false;
const fixedDeltaTime = 1000 * 3600 * 24 * 1;
const simulator = new Simulator(environment, users, samplingIntervalMiliSeconds, fixedTimeStep, fixedDeltaTime);
simulator.refreshProsumerManagerConnections();
new Server(simulator);
simulator.run();

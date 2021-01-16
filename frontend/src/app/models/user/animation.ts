export enum ParticleType {
	ELECTRICITY = 0,
	CURRENCY = 1
}

export interface Particle {
	value: number;
	type: ParticleType;
}

export interface AnimationData {
	inputNorth: Particle[];
	outputNorth: Particle[];
	outputEast: Particle[];
	inputSouth: Particle[];
	outputSouth: Particle[];
	inputWest: Particle[];
}

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AssetPath } from 'src/app/models/asset-path';
import { AnimationData, Particle, ParticleType } from 'src/app/models/user/animation';

@Component({
	selector: 'app-building-animation-card',
	templateUrl: './building-animation-card.component.html',
	styleUrls: ['./building-animation-card.component.css']
})
export class BuildingAnimationCardComponent implements OnInit {
	@ViewChild('outputNorth') outputNorth: ElementRef<HTMLElement>;
	@ViewChild('inputNorth') inputNorth: ElementRef<HTMLElement>;
	@ViewChild('outputEast') outputEast: ElementRef<HTMLElement>;
	@ViewChild('outputSouth') outputSouth: ElementRef<HTMLElement>;
	@ViewChild('inputSouth') inputSouth: ElementRef<HTMLElement>;
	@ViewChild('inputWest') inputWest: ElementRef<HTMLElement>;
	@Input() config: {
		center: AssetPath,
		north: AssetPath,
		east: AssetPath,
		south: AssetPath,
		west: AssetPath
	} = {
		center: AssetPath.CONSUMPTION,
		north: AssetPath.CONSUMPTION,
		east: AssetPath.CONSUMPTION,
		south: AssetPath.CONSUMPTION,
		west: AssetPath.CONSUMPTION
	};
	private particlePools: Map<ParticleType, SVGSVGElement[]> = new Map<ParticleType, SVGSVGElement[]>();
	private documentHidden = false;

	constructor() {}

	ngOnInit() {
		// Don't run animation when document is hidden
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.documentHidden = true;
			} else {
				this.documentHidden = false;
			}
		});
	}

	public animate = (
		animationData: AnimationData = {
			inputNorth: [],
			outputNorth: [],
			outputEast: [],
			inputSouth: [],
			outputSouth: [],
			inputWest: []
		}
	) => {
		if (!this.documentHidden) {
			const {inputNorth, outputNorth, outputEast, inputSouth, outputSouth, inputWest } = animationData;
			this.animateParticles(inputNorth, this.inputNorth);
			this.animateParticles(outputNorth, this.outputNorth);
			this.animateParticles(outputEast, this.outputEast);
			this.animateParticles(inputSouth, this.inputSouth);
			this.animateParticles(outputSouth, this.outputSouth);
			this.animateParticles(inputWest, this.inputWest);
		}
	}

	private animateParticles(particles: Particle[], pathRef: ElementRef<HTMLElement>) {
		if (particles.length > 0) {
			const path = pathRef.nativeElement;
			particles.forEach((particle) => {
				if (particle.value > 0) {
					this.animateParticle(particle.type, path);
				}
			});
		}
	}

	public animateParticle(type: ParticleType, path: HTMLElement) {
		const particle = this.getParticle(type);
		path.appendChild(particle);
		particle.classList.add('particle-animation');
		particle.classList.remove('hidden');
	}

	private getParticle(type: ParticleType): SVGSVGElement {
		let particle: SVGSVGElement;
		let particlePool = this.particlePools.get(type);
		if (particlePool === undefined) {
			particlePool = [];
			this.particlePools.set(type, particlePool);
		}
		if (particlePool.length === 0) {
			particle = this.createParticle(type);
			this.setupParticleAnimationEndEvent(particle, () => {
				particlePool.push(particle);
			});
		} else {
			particle = particlePool.pop();
		}
		return particle;
	}

	private setupParticleAnimationEndEvent(particle: SVGSVGElement, callback: () => void) {
		particle.addEventListener('webkitAnimationEnd', () => {
			this.removeParticleAnimation(particle);
			callback();
		});
		particle.addEventListener('animationend', () => {
			this.removeParticleAnimation(particle);
			callback();
		});
	}

	private removeParticleAnimation = (particle: SVGSVGElement) => {
		particle.classList.add('hidden');
		particle.classList.remove('particle-animation');
	}

	private createParticle(type: ParticleType): SVGSVGElement {
		const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		switch (type) {
			case ParticleType.ELECTRICITY:
				svgElement.innerHTML = '<use href="/assets/electricity.svg#electricity"></use>';
				break;
			case ParticleType.CURRENCY:
				svgElement.innerHTML = '<use href="/assets/coin.svg#coin"></use>';
				break;
			default:
				throw new Error('Invalid value provided for argument \'type\': \'' + type + '\'');
			}
		svgElement.setAttribute('class', 'particle hidden');
		return svgElement;
	}
}

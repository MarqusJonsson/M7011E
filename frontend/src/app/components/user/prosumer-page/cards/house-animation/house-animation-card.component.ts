import { Component, ElementRef, ViewChild } from '@angular/core';
import { HouseAnimationData, ParticleType } from 'src/app/models/user/animation';

@Component({
	selector: 'app-house-animation-card',
	templateUrl: './house-animation-card.component.html',
	styleUrls: ['./house-animation-card.component.css']
})
export class HouseAnimationCardComponent {
	@ViewChild('fromGeneratorPath') fromGeneratorPath: ElementRef<HTMLElement>;
	@ViewChild('toBatteryPath') toBatteryPath: ElementRef<HTMLElement>;
	@ViewChild('fromBatteryPath') fromBatteryPath: ElementRef<HTMLElement>;
	@ViewChild('toConsumptionPath') toConsumptionPath: ElementRef<HTMLElement>;
	@ViewChild('toPowerPlantPath') toPowerPlantPath: ElementRef<HTMLElement>;
	@ViewChild('fromPowerPlantPath') fromPowerPlantPath: ElementRef<HTMLElement>;
	private particlePools: Map<ParticleType, SVGSVGElement[]> = new Map<ParticleType, SVGSVGElement[]>();
	private animate = true;

	constructor() {
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.animate = false;
			} else {
				this.animate = true;
			}
		});
	}

	public animateData = (animationData: HouseAnimationData) => {
		if (this.animate) {
			if (animationData.electricityProduction > 0) {
				this.animateParticle(ParticleType.ELECTRICITY, this.fromGeneratorPath.nativeElement);
			}
			if (animationData.electricityToBattery > 0) {
				this.animateParticle(ParticleType.ELECTRICITY, this.toBatteryPath.nativeElement);
			}
			if (animationData.electricityFromBattery > 0) {
				this.animateParticle(ParticleType.ELECTRICITY, this.fromBatteryPath.nativeElement);
			}
			if (animationData.electricityConsumption > 0) {
				this.animateParticle(ParticleType.ELECTRICITY, this.toConsumptionPath.nativeElement);
			}
			if (animationData.electricityToPowerPlant > 0) {
				this.animateParticle(ParticleType.ELECTRICITY, this.toPowerPlantPath.nativeElement);
			}
			if (animationData.electricityFromPowerPlant > 0) {
				this.animateParticle(ParticleType.ELECTRICITY, this.fromPowerPlantPath.nativeElement);
			}
			if (animationData.currencyToPowerPlant > 0) {
				this.animateParticle(ParticleType.CURRENCY, this.toPowerPlantPath.nativeElement);
			}
			if (animationData.currencyFromPowerPlant > 0) {
				this.animateParticle(ParticleType.CURRENCY, this.fromPowerPlantPath.nativeElement);
			}
		}
	}

	private animateParticle(type: ParticleType, path: HTMLElement) {
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

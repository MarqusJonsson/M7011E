import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { setHouseOverproductionRatioMutation, setHouseUnderproductionRatioMutation } from 'src/app/models/graphql/house';
import { Prosumer } from 'src/app/models/graphql/prosumer';
import { HouseAnimationData } from 'src/app/models/user/animation';
import { DECIMALS } from 'src/app/models/user/page-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { SiFormatterService } from 'src/app/services/stiring-format/si-formatter.service';

@Component({
	selector: 'app-house-card',
	templateUrl: './house-card.component.html',
	styleUrls: ['./house-card.component.css', '../base-card.css']
})
export class HouseCardComponent {
	public data = {
		production: '',
		consumption: '',
		netProduction: '',
		toBattery: '',
		fromBattery: '',
		toPowerPlant: '',
		fromPowerPlant: '',
		isOverproducing: false,
		hasBlackout: false,
		blocked: false,
		overproductionRatioSliderValue: 0.5,
		underproductionRatioSliderValue: 0.5,
		overproductionPercentToPowerPlant: '',
		overproductionPercentToBattery: '',
		underproductionPercentToPowerPlant: '',
		underproductionPercentToBattery: ''
	};

	constructor(
		private siFormatterService: SiFormatterService,
		private graphqlService: GraphqlService
	) {}

	public setRatioSliders = (overproductionRatio: number, underproductionRatio: number) => {
		this.underproductionRatioSlider = underproductionRatio;
		this.overproductionRatioSlider = overproductionRatio;
	}

	public update = (prosumer: Prosumer, animate?: (animationData: HouseAnimationData) => void) => {
		this.data.production = `${this.siFormatterService.format(prosumer.house.electricityProduction, DECIMALS)}W`;
		this.data.consumption = `${this.siFormatterService.format(prosumer.house.electricityConsumption, DECIMALS)}W`;
		const netProduction = prosumer.house.electricityProduction - prosumer.house.electricityConsumption;
		if (netProduction >= 0) {
			this.data.isOverproducing = true;
		}
		this.data.netProduction = `${this.siFormatterService.format(netProduction, DECIMALS)}W`;
		let electricityToBattery: number;
		let electricityFromBattery: number;
		let electricityToPowerPlant: number;
		let electricityFromPowerPlant: number;
		if (netProduction < 0) { // In case of underproduction
			electricityToBattery = 0;
			electricityToPowerPlant = 0;
			if (prosumer.currency > 0) {
				electricityFromBattery = Math.min(Math.abs(netProduction) * prosumer.house.underproductionRatio, prosumer.house.battery.buffer);
				electricityFromPowerPlant = Math.abs(netProduction) - electricityFromBattery;
			} else {
				electricityFromBattery = Math.min(
					prosumer.house.electricityConsumption - prosumer.house.electricityProduction, prosumer.house.battery.buffer
				);
				electricityFromPowerPlant = 0;
			}
		} else { // In case of overproduction
			if (prosumer.isBlocked) {
				electricityToBattery = netProduction;
				electricityToPowerPlant = 0;
			} else {
				electricityToBattery = netProduction * prosumer.house.overproductionRatio;
				electricityToPowerPlant = netProduction - electricityToBattery;
			}
			electricityFromBattery = 0;
			electricityFromPowerPlant = 0;
		}
		this.data.toBattery = `${this.siFormatterService.format(electricityToBattery, DECIMALS)}W`;
		this.data.fromBattery = `${this.siFormatterService.format(electricityFromBattery, DECIMALS)}W`;
		this.data.toPowerPlant = `${this.siFormatterService.format(electricityToPowerPlant, DECIMALS)}W`;
		this.data.fromPowerPlant = `${this.siFormatterService.format(electricityFromPowerPlant, DECIMALS)}W`;
		this.data.hasBlackout = prosumer.house.hasBlackout;
		if (animate !== undefined) {
			const currencyToPowerPlant = electricityFromPowerPlant * prosumer.house.powerPlant.electricityBuyPrice;
			const currencyFromPowerPlant = electricityToPowerPlant * prosumer.house.powerPlant.electricitySellPrice;
			animate({
				electricityProduction: prosumer.house.electricityProduction,
				electricityConsumption: prosumer.house.electricityConsumption,
				electricityToBattery,
				electricityFromBattery,
				electricityToPowerPlant,
				electricityFromPowerPlant,
				currencyToPowerPlant,
				currencyFromPowerPlant
			});
		}
	}

	public overproductionSliderValueChange(event: MatSliderChange) {
		this.overproductionRatioSlider = event.value;
	}

	public underproductionSliderValueChange(event: MatSliderChange) {
		this.underproductionRatioSlider = event.value;
	}

	public mouseDownOverproductionRatio = () => {
		document.addEventListener('mouseup', () => {
			this.submitOverproductionRatio();
		}, { once: true });
	}

	public mouseDownUnderproductionRatio = () => {
		document.addEventListener('mouseup', () => {
			this.submitUnderproductionRatio();
		}, { once: true });
	}

	public submitOverproductionRatio = () => {
		this.graphqlService.mutate(setHouseOverproductionRatioMutation, {
			ratio: this.data.overproductionRatioSliderValue
		}).subscribe();
	}

	public submitUnderproductionRatio = () => {
		this.graphqlService.mutate(setHouseUnderproductionRatioMutation, {
			ratio: this.data.underproductionRatioSliderValue
		}).subscribe();
	}

	private set overproductionRatioSlider(ratio: number) {
		const overproductionRatioPercent = ratio * 100;
		this.data.overproductionPercentToPowerPlant = `${(100 - overproductionRatioPercent).toFixed(0)} %`;
		this.data.overproductionPercentToBattery = `${overproductionRatioPercent.toFixed(0)} %`;
		this.data.overproductionRatioSliderValue = ratio;
	}

	private set underproductionRatioSlider(ratio: number) {
		const underproductionRatioPercent = ratio * 100;
		this.data.underproductionPercentToPowerPlant = `${(100 - underproductionRatioPercent).toFixed(0)} %`;
		this.data.underproductionPercentToBattery = `${underproductionRatioPercent.toFixed(0)} %`;
		this.data.underproductionRatioSliderValue = ratio;
	}
}

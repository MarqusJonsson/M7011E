import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { House, setHouseOverproductionRatioMutation, setHouseUnderproductionRatioMutation } from 'src/app/models/graphql/house';
import { Prosumer, ProsumerQueryData } from 'src/app/models/graphql/prosumer';
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
	@ViewChild('productionText') private productionText: ElementRef<HTMLElement> | undefined;
	@ViewChild('consumptionText') private consumptionText: ElementRef<HTMLElement> | undefined;
	@ViewChild('netProductionText') private netProductionText: ElementRef<HTMLElement> | undefined;
	@ViewChild('toBatteryText') private toBatteryText: ElementRef<HTMLElement> | undefined;
	@ViewChild('fromBatteryText') private fromBatteryText: ElementRef<HTMLElement> | undefined;
	@ViewChild('toPowerPlantText') private toPowerPlantText: ElementRef<HTMLElement> | undefined;
	@ViewChild('fromPowerPlantText') private fromPowerPlantText: ElementRef<HTMLElement> | undefined;
	@ViewChild('overproductionPercentToPowerPlantText') private overproductionPercentToPowerPlantText: ElementRef<HTMLElement> | undefined;
	@ViewChild('overproductionPercentToBatteryText') private overproductionPercentToBatteryText: ElementRef<HTMLElement> | undefined;
	@ViewChild('underproductionPercentToPowerPlantText') private underproductionPercentToPowerPlantText: ElementRef<HTMLElement> | undefined;
	@ViewChild('underproductionPercentToBatteryText') private underproductionPercentToBatteryText: ElementRef<HTMLElement> | undefined;

	public overproductionRatioSliderValue = 0.5;
	public underproductionRatioSliderValue = 0.5;
	public isOverproducing = false;

	constructor(
		private siFormatterService: SiFormatterService,
		private graphqlService: GraphqlService
	) {}

	public setRatioSliders = (overproductionRatio: number, underproductionRatio: number) => {
		this.underproductionRatioSlider = underproductionRatio;
		this.overproductionRatioSlider = overproductionRatio;
	}

	public update = (prosumer: Prosumer, animate?: (animationData: HouseAnimationData) => void) => {
		this.productionText.nativeElement.innerText = `${this.siFormatterService.format(prosumer.house.electricityProduction, DECIMALS)}W`;
		this.consumptionText.nativeElement.innerText = `${this.siFormatterService.format(prosumer.house.electricityConsumption, DECIMALS)}W`;
		const netProduction = prosumer.house.electricityProduction - prosumer.house.electricityConsumption;
		if (netProduction >= 0) {
			this.isOverproducing = true;
		}
		this.netProductionText.nativeElement.innerText = `${this.siFormatterService.format(netProduction, DECIMALS)}W`;
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
			electricityToBattery = netProduction * prosumer.house.overproductionRatio;
			electricityToPowerPlant = netProduction - electricityToBattery;
			electricityFromBattery = 0;
			electricityFromPowerPlant = 0;
		}
		this.toBatteryText.nativeElement.innerText = `${this.siFormatterService.format(electricityToBattery, DECIMALS)}W`;
		this.fromBatteryText.nativeElement.innerText = `${this.siFormatterService.format(electricityFromBattery, DECIMALS)}W`;
		this.toPowerPlantText.nativeElement.innerText = `${this.siFormatterService.format(electricityToPowerPlant, DECIMALS)}W`;
		this.fromPowerPlantText.nativeElement.innerText = `${this.siFormatterService.format(electricityFromPowerPlant, DECIMALS)}W`;
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
			ratio: this.overproductionRatioSliderValue
		}).subscribe();
	}

	public submitUnderproductionRatio = () => {
		this.graphqlService.mutate(setHouseUnderproductionRatioMutation, {
			ratio: this.underproductionRatioSliderValue
		}).subscribe();
	}

	private set overproductionRatioSlider(ratio: number) {
		const overproductionRatioPercent = ratio * 100;
		this.overproductionPercentToPowerPlantText.nativeElement.innerText = `${(100 - overproductionRatioPercent).toFixed(0)} %`;
		this.overproductionPercentToBatteryText.nativeElement.innerText = `${overproductionRatioPercent.toFixed(0)} %`;
		this.overproductionRatioSliderValue = ratio;
	}

	private set underproductionRatioSlider(ratio: number) {
		const underproductionRatioPercent = ratio * 100;
		this.underproductionPercentToPowerPlantText.nativeElement.innerText = `${(100 - underproductionRatioPercent).toFixed(0)} %`;
		this.underproductionPercentToBatteryText.nativeElement.innerText = `${underproductionRatioPercent.toFixed(0)} %`;
		this.underproductionRatioSliderValue = ratio;
	}
}

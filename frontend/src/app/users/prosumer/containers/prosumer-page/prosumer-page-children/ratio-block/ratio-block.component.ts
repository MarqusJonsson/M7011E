import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { setHouseOverproductionRatioMutation, setHouseUnderproductionRatioMutation } from 'src/app/api/models/mutations/houseMutations';
import { GraphqlService } from 'src/app/api/services/graphql.service';

@Component({
	selector: 'ratio-block',
	templateUrl: './ratio-block.component.html',
	styleUrls: ['./ratio-block.component.css']
})
export class RatioBlockComponent implements OnInit {
	@ViewChild('overproductionSlider') overproductionSlider:ElementRef;
	@ViewChild('overproductionSubmit') overproductionSubmit:ElementRef;
	@ViewChild('electricityToBattery') electricityToBattery:ElementRef; 
	@ViewChild('electricityToPowerPlant') electricityToPowerPlant:ElementRef; 
	@ViewChild('underproductionSlider') underproductionSlider:ElementRef; 
	@ViewChild('underproductionSubmit') underproductionSubmit:ElementRef; 

	constructor(private graphqlService: GraphqlService) { }
	private overproductionSliderValue: number = 0;
	private underproductionSliderValue: number = 0;

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallBack(this.onUpdate);
		this.overproductionSubmit.nativeElement.onclick = () => {
			this.graphqlService.mutate(setHouseOverproductionRatioMutation, {ratio: this.overproductionSliderValue}).subscribe()
		}

		this.underproductionSubmit.nativeElement.onclick = () => {
			this.graphqlService.mutate(setHouseUnderproductionRatioMutation, {ratio: this.underproductionSliderValue}).subscribe()
		}
 
	}

	public overproductionSliderValueChange(event: MatSliderChange) {
		this.overproductionSliderValue = event.value;
	}

	public underproductionSliderValueChange(event: MatSliderChange) {
		this.underproductionSliderValue = event.value;
 	}

	private setElectricityToBattery (value: number, ratio: number) {

		this.electricityToBattery.nativeElement.innerText = value * ratio + " kWh";
	}

	private setElectricityToPowerPlant (value: number, ratio: number) {
		this.electricityToPowerPlant.nativeElement.innerText = value * (1-ratio) + " kWh";
	}

	private onUpdate = (data: any) => {
		const netProduction = data.prosumer.house.electricityProduction - data.prosumer.house.electricityConsumption;
		if(netProduction >= 0) {
			this.setElectricityToBattery(data.prosumer.house.electricityProduction, data.prosumer.house.overproductionBatteryToPowerPlantRatio);
			this.setElectricityToPowerPlant(data.prosumer.house.electricityProduction, data.prosumer.house.overproductionBatteryToPowerPlantRatio);
		}
		else {
			this.setElectricityToBattery(data.prosumer.house.electricityProduction, data.prosumer.house.underproductionBatteryToPowerPlantRatio);
			this.setElectricityToPowerPlant(data.prosumer.house.electricityProduction, data.prosumer.house.underproductionBatteryToPowerPlantRatio);
		}
			
	}

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { startPowerPlantProductionMutation, stopPowerPlantProductionMutation, updateProductionOutputRatioMutation } from 'src/app/api/models/mutations/powerPlantMutations';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';
import { Ws_to_kWh } from 'src/app/utils/electricity';

@Component({
	selector: 'power-plant-block',
	templateUrl: './power-plant-block.component.html',
	styleUrls: ['./power-plant-block.component.css']
})
export class PowerPlantBlockComponent implements OnInit {
	private productionOutputRatioSliderValue = 1;
	@ViewChild('production') production: ElementRef;
	@ViewChild('consumption') consumption: ElementRef;
	@ViewChild('netProduction') netProduction: ElementRef;
	@ViewChild('battery') battery: ElementRef;
	@ViewChild('batteryCapacity') batteryCapacity: ElementRef;
	@ViewChild('status') status: ElementRef;
	@ViewChild('productionOutputRatioButton') productionOutputRatioButton: ElementRef;
	@ViewChild('actionTimeDelay') actionTimeDelay: ElementRef;
	@ViewChild('actionTimeDelayDescription') actionTimeDelayDescription: ElementRef;
	@ViewChild('stopProduction') stopProduction: ElementRef;
	@ViewChild('startProduction') startProduction: ElementRef;
	constructor(private graphqlService: GraphqlService) { }

	ngOnInit(): void {

	}

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallback(this.onUpdate);
		this.productionOutputRatioButton.nativeElement.onclick = () => {
			this.graphqlService.mutate(updateProductionOutputRatioMutation, {productionOutputRatio: this.productionOutputRatioSliderValue}).subscribe();
		}

		this.startProduction.nativeElement.onclick = () => {
			this.graphqlService.mutate(startPowerPlantProductionMutation).subscribe();
		}

		this.stopProduction.nativeElement.onclick = () => {
			this.graphqlService.mutate(stopPowerPlantProductionMutation).subscribe();
		}

	}

	public setProduction(value: number, productionFlag: boolean) {
		if (productionFlag) this.production.nativeElement.innerText = Ws_to_kWh(value).toFixed(displayValuePrecision) + " kW";
		else this.production.nativeElement.innerText = 0 + " kW";
	}

	public setConsumption(value: number,  productionFlag: boolean) {
		if (productionFlag) this.consumption.nativeElement.innerText =	Ws_to_kWh(value).toFixed(displayValuePrecision) + " kW";
		else this.consumption.nativeElement.innerText = 0 + " kW"
	}

	public setNetProduction() {
		let production = parseFloat(this.production.nativeElement.innerText);
		let consumption = parseFloat(this.consumption.nativeElement.innerText);
		let netProduction = production - consumption;
		this.netProduction.nativeElement.innerText = netProduction.toFixed(displayValuePrecision) + " kW";
	}

	public setBattery(value: number) {
		this.battery.nativeElement.innerText =	Ws_to_kWh(value).toFixed(displayValuePrecision) + "/";
	}

	public setBatteryCapacity(value: number) {
		this.batteryCapacity.nativeElement.innerText =	Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}

	public setActionTimeDelay(value: number) {
		if(value <= 0) {
			this.actionTimeDelay.nativeElement.style.display = "none";
			this.actionTimeDelayDescription.nativeElement.style.display = "none";
		}
		else {
			this.actionTimeDelay.nativeElement.style.display = "inline";
			this.actionTimeDelayDescription.nativeElement.style.display = "inline";
			this.actionTimeDelay.nativeElement.innerText = value.toFixed(displayValuePrecision) + " s";
		}
	}

	public setStatus(value: boolean) {
		if(value == true)
		this.status.nativeElement.innerText = "Running";
		else
		this.status.nativeElement.innerText = "Stopped"; 
	}

	public productionOutputRatioSliderValueChange(event: MatSliderChange) {
		this.productionOutputRatioSliderValue = event.value;
 	}


	public onUpdate = (data: any) => {
		this.setBattery(data.manager.powerPlant.battery.buffer);
		this.setBatteryCapacity(data.manager.powerPlant.battery.capacity);
		this.setProduction(data.manager.powerPlant.electricityProduction * data.manager.powerPlant.productionOutputRatio, data.manager.powerPlant.productionFlag);
		this.setConsumption(data.manager.powerPlant.electricityConsumption, data.manager.powerPlant.productionFlag)
		this.setNetProduction();
		this.setStatus(data.manager.powerPlant.productionFlag);
		this.setActionTimeDelay(data.manager.powerPlant.delayTimeS);
	}

}

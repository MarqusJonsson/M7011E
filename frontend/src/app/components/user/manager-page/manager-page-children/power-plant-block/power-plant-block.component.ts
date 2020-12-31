import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { startPowerPlantProductionMutation, stopPowerPlantProductionMutation, updateProductionOutputRatioMutation } from 'src/app/models/graphql/powerPlant';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { displayValuePrecision } from 'src/app/models/user/pageConstants';
import { Ws_to_kWh } from 'src/app/models/user/electricity';

@Component({
	selector: 'power-plant-block',
	templateUrl: './power-plant-block.component.html',
	styleUrls: ['./power-plant-block.component.css']
})
export class PowerPlantBlockComponent implements AfterViewInit {
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

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallback(this.onUpdate);
		this.productionOutputRatioButton.nativeElement.onclick = () => {
			this.graphqlService.mutate(
				updateProductionOutputRatioMutation,
				{productionOutputRatio: this.productionOutputRatioSliderValue}
			).subscribe();
		};

		this.startProduction.nativeElement.onclick = () => {
			this.graphqlService.mutate(startPowerPlantProductionMutation).subscribe();
		};

		this.stopProduction.nativeElement.onclick = () => {
			this.graphqlService.mutate(stopPowerPlantProductionMutation).subscribe();
		};
	}

	public setProduction(value: number) {
		this.production.nativeElement.innerText = Ws_to_kWh(value).toFixed(displayValuePrecision) + ' kW';
	}

	public setConsumption(value: number) {
		this.consumption.nativeElement.innerText =	Ws_to_kWh(value).toFixed(displayValuePrecision) + ' kW';
	}

	public setNetProduction() {
		const production = parseFloat(this.production.nativeElement.innerText);
		const consumption = parseFloat(this.consumption.nativeElement.innerText);
		const netProduction = production - consumption;
		this.netProduction.nativeElement.innerText = netProduction.toFixed(displayValuePrecision) + ' kW';
	}

	public setBattery(value: number) {
		this.battery.nativeElement.innerText =	Ws_to_kWh(value).toFixed(displayValuePrecision) + '/';
	}

	public setBatteryCapacity(value: number) {
		this.batteryCapacity.nativeElement.innerText =	Ws_to_kWh(value).toFixed(displayValuePrecision) + ' kWh';
	}

	public setActionTimeDelay(value: number) {
		if (value <= 0) {
			this.actionTimeDelay.nativeElement.style.display = 'none';
			this.actionTimeDelayDescription.nativeElement.style.display = 'none';
		} else {
			this.actionTimeDelay.nativeElement.style.display = 'inline';
			this.actionTimeDelayDescription.nativeElement.style.display = 'inline';
			this.actionTimeDelay.nativeElement.innerText = value.toFixed(displayValuePrecision) + ' s';
		}
	}

	public setStatus(value: boolean, hasBlackout: boolean) {
		this.status.nativeElement.innerText = (value ? 'Running' : 'Stopped') + (hasBlackout ? ' (has blackout)' : '');
	}

	public productionOutputRatioSliderValueChange(event: MatSliderChange) {
		this.productionOutputRatioSliderValue = event.value;
 	}


	public onUpdate = (data: any) => {
		const powerPlant = data.manager.powerPlant;
		this.setBattery(powerPlant.battery.buffer);
		this.setBatteryCapacity(powerPlant.battery.capacity);
		this.setProduction(powerPlant.electricityProduction * powerPlant.productionOutputRatio);
		this.setConsumption(powerPlant.electricityConsumption);
		this.setNetProduction();
		this.setStatus(powerPlant.productionFlag, powerPlant.hasBlackout);
		this.setActionTimeDelay(powerPlant.delayTimeS);
	}

}

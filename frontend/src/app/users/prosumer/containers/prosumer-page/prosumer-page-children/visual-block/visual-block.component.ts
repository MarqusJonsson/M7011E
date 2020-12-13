import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { geoDataContent, geoDataQuery } from 'src/app/api/models/geoDataContent';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';
import { Ws_to_kWh } from 'src/app/utils/electricity';
@Component({
  selector: 'prosumer-page-visual-block',
  templateUrl: './visual-block.component.html',
  styleUrls: ['./visual-block.component.css']
})
export class VisualBlockComponent implements OnInit {
	@ViewChild('production') production:ElementRef;
	@ViewChild('consumption') consumption:ElementRef;
	@ViewChild('netProduction') netProduction:ElementRef;
	@ViewChild('temperature') temperature:ElementRef;
	@ViewChild('windSpeed') windSpeed:ElementRef;
	@ViewChild('battery') battery:ElementRef;
	@ViewChild('batteryCapacity') batteryCapacity:ElementRef;




	constructor(private graphqlService: GraphqlService) { }

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallBack(this.onUpdate);
	}

	public setProduction(value: number) {
		this.production.nativeElement.innerText = value + " kWh";
	}

	public setConsumption(value: number) {
		this.consumption.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}

	public setNetProduction() {
		let production = parseFloat(this.production.nativeElement.innerText);
		let consumption = parseFloat(this.consumption.nativeElement.innerText);
		let netProduction = production - consumption;
		this.netProduction.nativeElement.innerText = netProduction + " kWh";
	}

	public setTemperature(value: number) {
		this.temperature.nativeElement.innerText =value.toFixed(displayValuePrecision) + " C";
	}

	public setWindSpeed(value: number) {
		this.windSpeed.nativeElement.innerText = value.toFixed(displayValuePrecision) + " m/s";
	}

	public setBattery(value: number) {
		this.battery.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + "/";
	}

	public setBatteryCapacity(value: number) {
		this.batteryCapacity.nativeElement.innerText = Ws_to_kWh(value).toFixed(displayValuePrecision) + " kWh";
	}

	public onUpdate = (data: any) => {
		this.setProduction(data.house.electricityProduction);
		this.setConsumption(data.house.electricityConsumption);
		this.setNetProduction();
		this.setTemperature(data.house.geoData.temperature);
		this.setWindSpeed(data.house.geoData.windSpeed);
		this.setBattery(data.house.battery.buffer);
		this.setBatteryCapacity(data.house.battery.capacity);
	}

}

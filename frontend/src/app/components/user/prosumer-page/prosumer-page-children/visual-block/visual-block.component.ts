import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { GraphComponent } from 'src/app/components/user/shared/graph/graph.component';
import { displayValuePrecision } from 'src/app/models/user/pageConstants';
import { Ws_to_kWh } from 'src/app/models/user/electricity';
@Component({
	selector: 'prosumer-page-visual-block',
	templateUrl: './visual-block.component.html',
	styleUrls: ['./visual-block.component.css']
})
export class VisualBlockComponent implements AfterViewInit {
	@ViewChild('production') production: ElementRef;
	@ViewChild('consumption') consumption: ElementRef;
	@ViewChild('netProduction') netProduction: ElementRef;
	@ViewChild('temperature') temperature: ElementRef;
	@ViewChild('windSpeed') windSpeed: ElementRef;
	@ViewChild('battery') battery: ElementRef;
	@ViewChild('batteryCapacity') batteryCapacity: ElementRef;
	@ViewChild(GraphComponent) graph: GraphComponent;
	constructor(private graphqlService: GraphqlService) {}

	ngAfterViewInit() {
		this.graph.createPlot(
			[
				{ x: [], y: [], type: 'scatter', mode: 'lines', marker: {color: 'red'}, name: 'Consumption' },
				{ x: [], y: [], type: 'scatter', mode: 'lines', marker: {color: 'green'}, name: 'Production' },
				{ x: [], y: [], type: 'scatter', mode: 'lines', marker: {color: 'blue'}, name: 'Wind speed' },
				{ x: [], y: [], type: 'scatter', mode: 'lines', marker: {color: 'orange'}, name: 'Temperature' }
			],
			{ autosize: true }
		);
		this.graphqlService.addSubscriberCallback(this.onUpdate);
	}

	public setProduction(value: number) {
		this.production.nativeElement.innerText = value.toFixed(displayValuePrecision) + ' W';
	}

	public setConsumption(value: number) {
		this.consumption.nativeElement.innerText = value.toFixed(displayValuePrecision) + ' W';
	}

	public setNetProduction() {
		const production = parseFloat(this.production.nativeElement.innerText);
		const consumption = parseFloat(this.consumption.nativeElement.innerText);
		const netProduction = production - consumption;
		this.netProduction.nativeElement.innerText = netProduction.toFixed(displayValuePrecision) + ' W';
	}

	public setTemperature(value: number) {
		this.temperature.nativeElement.innerText = value.toFixed(displayValuePrecision) + ' C';
	}

	public setWindSpeed(value: number) {
		this.windSpeed.nativeElement.innerText = value.toFixed(displayValuePrecision) + ' m/s';
	}

	public setBattery(value: number) {
		this.battery.nativeElement.innerText =  Ws_to_kWh(value).toFixed(displayValuePrecision) + '/';
	}

	public setBatteryCapacity(value: number) {
		this.batteryCapacity.nativeElement.innerText = Ws_to_kWh(value).toFixed(displayValuePrecision) + ' kWh';
	}

	public onUpdate = (data: any) => {
		const house = data.prosumer.house;
		this.setProduction(house.electricityProduction);
		this.setConsumption(house.electricityConsumption);
		this.setNetProduction();
		this.setTemperature(house.geoData.temperature);
		this.setWindSpeed(house.geoData.windSpeed);
		this.setBattery(house.battery.buffer);
		this.setBatteryCapacity(house.battery.capacity);
		const time = new Date();
		this.graph.appendToPlot(
			[[time], [time], [time], [time]],
			[[house.electricityConsumption], [house.electricityProduction], [house.geoData.windSpeed], [house.geoData.temperature]]
		);
	}
}

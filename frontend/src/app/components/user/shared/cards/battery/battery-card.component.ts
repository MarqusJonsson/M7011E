import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Battery } from 'src/app/models/graphql/battery';
import { DECIMALS } from 'src/app/models/user/page-constants';
import { SiFormatterService } from 'src/app/services/stiring-format/si-formatter.service';
import { GraphComponent } from './graph/graph.component';

@Component({
	selector: 'app-battery-card',
	templateUrl: './battery-card.component.html',
	styleUrls: ['./battery-card.component.css', '../base-card.css']
})
export class BatteryCardComponent implements AfterViewInit {
	@ViewChild('graph') graph: GraphComponent;
	@Input() graphId = 'battery-graph';
	public data = {
		buffer: '',
		capacity: '',
		percent: ''
	};

	constructor(
		private siFormatterService: SiFormatterService,
		private hostElement: ElementRef
	) {}

	public ngAfterViewInit(): void {
		const batteryColor = getComputedStyle(this.hostElement.nativeElement).getPropertyValue('--battery-color');
		this.graph.createPlot(batteryColor, [{ name: 'Battery percent', lineColor: batteryColor }]);
	}

	public update = (battery: Battery) => {
		this.data.capacity = `${this.siFormatterService.format(battery.capacity, DECIMALS)}Wh`;
		this.data.buffer = `${this.siFormatterService.format(battery.buffer, DECIMALS)}Wh`;
		const percent = battery.buffer / battery.capacity * 100;
		this.data.percent = `${percent.toFixed(3)} %`;
		const time = new Date();
		this.graph.appendToPlot(
			[[time]],
			[[percent]]
		);
	}
}

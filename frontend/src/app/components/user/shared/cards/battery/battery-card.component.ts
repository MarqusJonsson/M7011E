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
	@ViewChild('capacityText') private capacityText: ElementRef<HTMLElement> | undefined;
	@ViewChild('bufferText') private bufferText: ElementRef<HTMLElement> | undefined;
	@ViewChild('graph') graph: GraphComponent;

	constructor(
		private siFormatterService: SiFormatterService,
		private hostElement: ElementRef
	) {}

	public ngAfterViewInit(): void {
		const batteryColor = getComputedStyle(this.hostElement.nativeElement).getPropertyValue('--battery-color');
		this.graph.createPlot(batteryColor, [{ name: 'Battery percent', lineColor: batteryColor }]);
	}

	public update = (battery: Battery) => {
		this.capacityText.nativeElement.innerText = `${this.siFormatterService.format(battery.capacity, DECIMALS)}Wh`;
		this.bufferText.nativeElement.innerText = `${this.siFormatterService.format(battery.buffer, DECIMALS)}Wh`;
		const time = new Date();
		this.graph.appendToPlot(
			[[time]],
			[[battery.buffer / battery.capacity * 100]]
		);
	}
}

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { GeoData } from 'src/app/models/graphql/geoData';
import { ProsumerQueryData } from 'src/app/models/graphql/prosumer';
import { DECIMALS } from 'src/app/models/user/page-constants';
import { SiFormatterService } from 'src/app/services/stiring-format/si-formatter.service';

@Component({
	selector: 'app-geo-data-card',
	templateUrl: './geo-data-card.component.html',
	styleUrls: ['./geo-data-card.component.css', '../base-card.css']
})
export class GeoDataCardComponent {
	@ViewChild('windSpeedText') private windSpeedText: ElementRef<HTMLElement> | undefined;
	@ViewChild('temperatureText') private temperatureText: ElementRef<HTMLElement> | undefined;

	constructor(
		private siFormatterService: SiFormatterService
	) {}

	public update = (geoData: GeoData) => {
		this.windSpeedText.nativeElement.innerText = `${this.siFormatterService.format(geoData.windSpeed, DECIMALS)}m/s`;
		this.temperatureText.nativeElement.innerText = `${this.siFormatterService.format(geoData.temperature, DECIMALS)} °C`;
	}
}

import { Component } from '@angular/core';
import { GeoData } from 'src/app/models/graphql/geoData';
import { DECIMALS } from 'src/app/models/user/page-constants';
import { SiFormatterService } from 'src/app/services/stiring-format/si-formatter.service';

@Component({
	selector: 'app-geo-data-card',
	templateUrl: './geo-data-card.component.html',
	styleUrls: ['./geo-data-card.component.css', '../base-card.css']
})
export class GeoDataCardComponent {
	public data = {
		windSpeed: '',
		temperature: ''
	};

	constructor(
		private siFormatterService: SiFormatterService
	) {}

	public update = (geoData: GeoData) => {
		this.data.windSpeed = `${this.siFormatterService.format(geoData.windSpeed, DECIMALS)}m/s`;
		this.data.temperature = `${this.siFormatterService.format(geoData.temperature, DECIMALS)} °C`;
	}
}

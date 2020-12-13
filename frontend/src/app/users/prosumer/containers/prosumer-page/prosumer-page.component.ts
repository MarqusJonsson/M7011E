import { Component, OnInit } from '@angular/core';
import { geoDataContent, geoDataQuery } from 'src/app/api/models/geoDataContent';
import { houseContent, houseQuery } from 'src/app/api/models/houseContent';
import { prosumerQuery } from 'src/app/api/models/prosumerContent';
import { GraphqlService } from '../../../../api/services/graphql.service';
@Component({
	selector: 'app-prosumer-page',
	templateUrl: './prosumer-page.component.html',
	styleUrls: ['./prosumer-page.component.css']
})
export class ProsumerPageComponent implements OnInit {

	constructor(private graphqlService: GraphqlService) { }

	ngOnInit(): void {
	}

  ngAfterViewInit() {
	setInterval(this.fetchProsumerData, 1000);
	}

	public fetchProsumerData = () => {
		this.graphqlService.query(prosumerQuery).subscribe((data: any) => {
			console.log("in fetch", data.prosumer.house.electricityConsumption);
		});
	}
}

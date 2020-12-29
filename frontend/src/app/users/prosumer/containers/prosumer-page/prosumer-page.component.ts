import { Component, OnInit } from '@angular/core';
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
		this.graphqlService.startQueryInterval(prosumerQuery, 1000);
	}
}

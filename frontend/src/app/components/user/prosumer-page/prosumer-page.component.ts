import { Component, OnInit } from '@angular/core';
import { prosumerQuery } from 'src/app/models/graphql/prosumer';
import { GraphqlService } from '../../../services/graphql/graphql.service';
@Component({
	selector: 'prosumer-page',
	templateUrl: './prosumer-page.component.html',
	styleUrls: ['./prosumer-page.component.css']
})
export class ProsumerPageComponent implements OnInit {

	constructor(private graphqlService: GraphqlService) { }

	ngOnInit(): void {
		this.graphqlService.startQueryInterval(prosumerQuery, 1000);
	}
}

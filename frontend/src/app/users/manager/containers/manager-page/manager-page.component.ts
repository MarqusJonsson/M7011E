import { Component, OnInit } from '@angular/core';
import { managerQuery } from 'src/app/api/models/managerContent';
import { GraphqlService } from 'src/app/api/services/graphql.service';

@Component({
	selector: 'manager-page',
	templateUrl: './manager-page.component.html',
	styleUrls: ['./manager-page.component.css']
})
export class ManagerPageComponent implements OnInit {

	constructor(private graphqlService: GraphqlService) { }

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.graphqlService.startQueryInterval(managerQuery, 1000);
	}
}

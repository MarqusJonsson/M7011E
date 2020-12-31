import { AfterViewInit, Component } from '@angular/core';
import { managerQuery } from 'src/app/models/graphql/manager';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
	selector: 'manager-page',
	templateUrl: './manager-page.component.html',
	styleUrls: ['./manager-page.component.css']
})
export class ManagerPageComponent implements AfterViewInit {

	constructor(private graphqlService: GraphqlService) { }

	ngAfterViewInit() {
		this.graphqlService.startQueryInterval(managerQuery, 1000);
	}
}

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { managerQuery, ManagerQueryData } from 'src/app/models/graphql/manager';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { BatteryCardComponent } from '../shared/cards/battery/battery-card.component';
import { GeoDataCardComponent } from '../shared/cards/geo-data/geo-data-card.component';
import { PowerPlantCardComponent } from '../shared/cards/power-plant/power-plant-card.component';
import { UserCardComponent } from '../shared/cards/user/user-card.component';
import { ProsumerListCardComponent } from './cards/prosumer-list/prosumer-list-card.component';

@Component({
	selector: 'app-manager-page',
	templateUrl: './manager-page.component.html',
	styleUrls: ['./manager-page.component.css']
})
export class ManagerPageComponent implements AfterViewInit {
	@ViewChild('batteryCard') batteryCard: BatteryCardComponent;
	@ViewChild('geoDataCard') geoDataCard: GeoDataCardComponent;
	@ViewChild('userCard') userCard: UserCardComponent;
	@ViewChild('powerPlantCard') powerPlantCard: PowerPlantCardComponent;
	@ViewChild('prosumerListCard') prosumerListCard: ProsumerListCardComponent;

	constructor(private graphqlService: GraphqlService) { }

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallback((data: ManagerQueryData) => {
			const { manager } = data;
			this.batteryCard.update(manager.powerPlant.battery);
			this.geoDataCard.update(manager.powerPlant.geoData);
			this.userCard.update(manager.currency);
			this.powerPlantCard.update(manager.powerPlant);
			this.prosumerListCard.update(manager.prosumers);
		});
		this.graphqlService.addSingleFetchCallback((data: ManagerQueryData) => {
			this.powerPlantCard.setProductionOutputRatioSliderValue(data.manager.powerPlant.productionOutputRatio);
		});
		this.graphqlService.startQueryInterval(managerQuery, 1000);
	}
}

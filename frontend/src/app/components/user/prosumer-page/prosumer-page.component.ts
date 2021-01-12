import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { prosumerQuery, ProsumerQueryData } from 'src/app/models/graphql/prosumer';
import { GraphqlService } from '../../../services/graphql/graphql.service';
import { BatteryCardComponent } from '../shared/cards/battery/battery-card.component';
import { GeoDataCardComponent } from '../shared/cards/geo-data/geo-data-card.component';
import { HouseCardComponent } from '../shared/cards/house/house-card.component';
import { PowerPlantCardComponent } from '../shared/cards/power-plant/power-plant-card.component';
import { UserCardComponent } from '../shared/cards/user/user-card.component';
import { HouseAnimationCardComponent } from './cards/house-animation/house-animation-card.component';

@Component({
	selector: 'app-prosumer-page',
	templateUrl: './prosumer-page.component.html',
	styleUrls: ['./prosumer-page.component.css']
})
export class ProsumerPageComponent implements AfterViewInit {
	@ViewChild('batteryCard') batteryCard: BatteryCardComponent;
	@ViewChild('geoDataCard') geoDataCard: GeoDataCardComponent;
	@ViewChild('userCard') userCard: UserCardComponent;
	@ViewChild('powerPlantCard') powerPlantCard: PowerPlantCardComponent;
	@ViewChild('houseCard') houseCard: HouseCardComponent;
	@ViewChild('houseAnimationCard') houseAnimationCard: HouseAnimationCardComponent;

	constructor(private graphqlService: GraphqlService) {}

	ngAfterViewInit(): void {
		this.graphqlService.addSubscriberCallback((data: ProsumerQueryData) => {
			const { prosumer } = data;
			this.batteryCard.update(prosumer.house.battery);
			this.geoDataCard.update(prosumer.house.geoData);
			this.userCard.update(prosumer.currency);
			this.powerPlantCard.update(prosumer.house.powerPlant);
			this.houseCard.update(prosumer, this.houseAnimationCard.animateData);
		});
		this.graphqlService.addSingleFetchCallback((data: ProsumerQueryData) => {
			const { prosumer: { house: { overproductionRatio, underproductionRatio } } } = data;
			this.houseCard.setRatioSliders(overproductionRatio, underproductionRatio);
		});
		this.graphqlService.startQueryInterval(prosumerQuery, 1000);
	}
}

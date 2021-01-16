import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { AssetPath } from 'src/app/models/asset-path';
import { Prosumer, prosumerQuery, ProsumerQueryData } from 'src/app/models/graphql/prosumer';
import { GraphqlService } from '../../../services/graphql/graphql.service';
import { BuildingAnimationCardComponent } from '../shared/cards/building-animation/building-animation-card.component';
import { BatteryCardComponent } from '../shared/cards/battery/battery-card.component';
import { GeoDataCardComponent } from '../shared/cards/geo-data/geo-data-card.component';
import { HouseCardComponent } from '../shared/cards/house/house-card.component';
import { PowerPlantCardComponent } from '../shared/cards/power-plant/power-plant-card.component';
import { UserCardComponent } from '../shared/cards/user/user-card.component';

@Component({
	selector: 'app-prosumer-page',
	templateUrl: './prosumer-page.component.html',
	styleUrls: ['./prosumer-page.component.css']
})
export class ProsumerPageComponent implements AfterViewInit, OnDestroy {
	@ViewChild('batteryCard') batteryCard: BatteryCardComponent;
	@ViewChild('geoDataCard') geoDataCard: GeoDataCardComponent;
	@ViewChild('userCard') userCard: UserCardComponent;
	@ViewChild('powerPlantCard') powerPlantCard: PowerPlantCardComponent;
	@ViewChild('houseCard') houseCard: HouseCardComponent;
	@ViewChild('buildingAnimationCard') buildingAnimationCard: BuildingAnimationCardComponent;
	@Input() prosumer: Prosumer;
	@Input() startQueryInterval = true;
	@Input() profilePictureUserId: number;
	@Input() showNavBar = true;
	private callbackId: number;

	constructor(private graphqlService: GraphqlService) {}

	get AssetPath() {
		return AssetPath;
	}

	public ngAfterViewInit(): void {
		if (this.prosumer !== undefined) {
			this.update(this.prosumer);
		}
		this.callbackId = this.graphqlService.addSubscriberCallback((data: ProsumerQueryData) => {
			let prosumer: Prosumer;
			if (this.prosumer !== undefined) {
				prosumer = this.prosumer;
			} else {
				prosumer = data.prosumer;
			}
			this.update(prosumer);
		});
		this.graphqlService.addSingleFetchCallback((data: ProsumerQueryData) => {
			let overproductionRatio: number;
			let underproductionRatio: number;
			if (this.prosumer !== undefined) {
				overproductionRatio = this.prosumer.house.overproductionRatio;
				underproductionRatio = this.prosumer.house.underproductionRatio;
			} else {
				overproductionRatio = data.prosumer.house.overproductionRatio;
				underproductionRatio = data.prosumer.house.underproductionRatio;
			}
			this.houseCard.setRatioSliders(overproductionRatio, underproductionRatio);
		});
		if (this.startQueryInterval) {
			this.graphqlService.startQueryInterval(prosumerQuery, 1000);
		}
	}

	public ngOnDestroy() {
		this.graphqlService.removeSubscriberCallback(this.callbackId);
	}

	private update(prosumer: Prosumer) {
		this.batteryCard.update(prosumer.house.battery);
		this.geoDataCard.update(prosumer.house.geoData);
		this.userCard.update(prosumer.currency, prosumer.isBlocked);
		this.powerPlantCard.update(prosumer.house.powerPlant);
		this.houseCard.update(prosumer, this.buildingAnimationCard.animate);
	}
}

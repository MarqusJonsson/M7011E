import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';
import { Ws_to_kWh } from 'src/app/utils/electricity';

@Component({
	selector: 'manager-market-block',
	templateUrl: './manager-market.component.html',
	styleUrls: ['./manager-market.component.css']
})
export class ManagerMarketComponent implements OnInit {
	@ViewChild('marketDemand') marketDemand:ElementRef;
	@ViewChild('suggestBuyPrice') suggestBuyPrice:ElementRef;
	@ViewChild('suggestSellPrice') suggestSellPrice:ElementRef;
	@ViewChild('electricityPrice') electricityPrice:ElementRef;
	@ViewChild('currency') currency:ElementRef;
	@ViewChild('totalDemand') totalDemand:ElementRef;
 
	constructor(private hostElement: ElementRef, private graphqlService: GraphqlService) { }
		ngOnInit(): void {

	}

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallBack(this.onUpdate);
	}
	public setMarketDemand(value: number) {
		this.marketDemand.nativeElement.innerText = value.toFixed(displayValuePrecision) + " currency/J";
	}

	public setSuggestBuyPrice(value: number) {
		this.suggestBuyPrice.nativeElement.innerText = (value * 3600000).toFixed(displayValuePrecision) + " currency/kWh";
	}

	public setSuggestSellPrice(value: number) {
		this.suggestSellPrice.nativeElement.innerText = (value * 3600000).toFixed(displayValuePrecision) + " currency/kWh";
	}

	public setElectricityPrice(value: number) {
		this.electricityPrice.nativeElement.innerText = (value * 3600000).toFixed(displayValuePrecision) + " currency/kWh";
	}

	public setCurrency(value: number) {
		this.currency.nativeElement.innerText = value.toFixed(displayValuePrecision);
	}

	public setTotalDemand(value: number) {
		this.totalDemand.nativeElement.innerText = value.toFixed(displayValuePrecision) + " J";
	}

	public onUpdate = (data: any) => {
		this.setCurrency(data.manager.currency);
		this.setElectricityPrice(data.manager.powerPlant.electricityBuyPrice);
		this.setSuggestBuyPrice(data.manager.powerPlant.modelledElectricityBuyPrice);
		this.setSuggestSellPrice(data.manager.powerPlant.modelledElectricitySellPrice);
		this.setTotalDemand(data.manager.powerPlant.totalDemand);
	}
}

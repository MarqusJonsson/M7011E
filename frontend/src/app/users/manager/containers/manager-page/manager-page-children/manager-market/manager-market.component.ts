import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';
import { Ws_to_kWh, kWh_to_Ws } from 'src/app/utils/electricity';

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
 
	constructor(private hostElement: ElementRef, private graphqlService: GraphqlService) { }
		ngOnInit(): void {

	}

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallBack(this.onUpdate);
	}
	public setMarketDemand(value: number) {
		this.marketDemand.nativeElement.innerText = kWh_to_Ws(value).toFixed(displayValuePrecision) + " kwh/currency";
	}

	public setSuggestBuyPrice(value: number) {
		this.suggestBuyPrice.nativeElement.innerText = kWh_to_Ws(value).toFixed(displayValuePrecision) + " kWh/currency";
	}

	public setSuggestSellPrice(value: number) {
		this.suggestSellPrice.nativeElement.innerText = kWh_to_Ws(value).toFixed(displayValuePrecision) + " kWh/currency";
	}

	public setElectricityPrice(value: number) {
		this.electricityPrice.nativeElement.innerText = kWh_to_Ws(value).toFixed(displayValuePrecision) + " kWh/currency";
	}

	public setCurrency(value: number) {
		this.currency.nativeElement.innerText = value.toFixed(displayValuePrecision);
	}

	public onUpdate = (data: any) => {
		this.setCurrency(data.manager.currency);
		this.setElectricityPrice(data.manager.powerPlant.electricityBuyPrice);
		this.setSuggestBuyPrice(data.manager.powerPlant.modelledElectricityBuyPrice);
		this.setSuggestSellPrice(data.manager.powerPlant.modelledElectricitySellPrice);
	}
}

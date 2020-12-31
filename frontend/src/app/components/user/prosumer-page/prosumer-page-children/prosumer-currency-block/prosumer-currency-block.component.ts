import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { displayValuePrecision } from 'src/app/models/user/pageConstants';
import { Ws_per_kWh } from 'src/app/models/user/electricity';

@Component({
	selector: 'prosumer-currency-block',
	templateUrl: './prosumer-currency-block.component.html',
	styleUrls: ['./prosumer-currency-block.component.css']
})
export class ProsumerCurrencyBlockComponent implements AfterViewInit {
	@ViewChild('currency') currency: ElementRef;
	@ViewChild('marketBuyPrice') marketBuyPrice: ElementRef;
	@ViewChild('marketSellPrice') marketSellPrice: ElementRef;

	constructor(private graphqlService: GraphqlService) { }

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallback(this.onUpdate);
	}

	public setCurrency(value: number) {
		this.currency.nativeElement.innerText = value.toFixed(displayValuePrecision);
	}

	public setMarketBuyPrice(value: number) {
		this.marketBuyPrice.nativeElement.innerText = (value *  Ws_per_kWh).toFixed(displayValuePrecision) + ' currency/kWh';
	}

	public setMarketSellPrice(value: number) {
		this.marketSellPrice.nativeElement.innerText = (value *  Ws_per_kWh).toFixed(displayValuePrecision) + ' currency/kWh';
	}

	public onUpdate = (data: any) => {
		this.setCurrency(data.prosumer.currency);
		this.setMarketBuyPrice(data.prosumer.house.powerPlant.electricityBuyPrice);
		this.setMarketSellPrice(data.prosumer.house.powerPlant.electricitySellPrice);

	}

}

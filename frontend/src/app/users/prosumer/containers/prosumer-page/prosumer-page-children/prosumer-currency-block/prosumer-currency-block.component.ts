import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';

@Component({
  selector: 'prosumer-currency-block',
  templateUrl: './prosumer-currency-block.component.html',
  styleUrls: ['./prosumer-currency-block.component.css']
})
export class ProsumerCurrencyBlockComponent implements OnInit {
	@ViewChild('currency') currency:ElementRef;
	@ViewChild('marketPrice') marketPrice:ElementRef;
	constructor(private graphqlService: GraphqlService) { }

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallback(this.onUpdate);
	}

	public setCurrency(value: number) {
		this.currency.nativeElement.innerText = value.toFixed(displayValuePrecision);
	}

	public setMarketPrice(value: number) {
		this.marketPrice.nativeElement.innerText = (value * 3600000).toFixed(displayValuePrecision) + " currency/kWh";
	}

	public onUpdate = (data: any) => {
		this.setCurrency(data.prosumer.currency);
		this.setMarketPrice(data.prosumer.house.powerPlant.electricityBuyPrice);
	}

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/alert/services/alert.service';
import { updateElectricityPrices } from 'src/app/api/models/mutations/powerPlantMutations';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { displayValuePrecision } from 'src/app/users/shared/pageConstants';
import { Ws_per_kWh } from 'src/app/utils/electricity';

@Component({
	selector: 'manager-market-block',
	templateUrl: './manager-market.component.html',
	styleUrls: ['./manager-market.component.css']
})
export class ManagerMarketComponent implements OnInit {
	@ViewChild('marketDemand') marketDemand:ElementRef;
	@ViewChild('suggestBuyPrice') suggestBuyPrice:ElementRef;
	@ViewChild('suggestSellPrice') suggestSellPrice:ElementRef;
	@ViewChild('electricityBuyPrice') electricityBuyPrice:ElementRef;
	@ViewChild('electricitySellPrice') electricitySellPrice:ElementRef;
	@ViewChild('newElectricityBuyPrice') newElectricityBuyPrice:ElementRef;
	@ViewChild('newElectricitySellPrice') newElectricitySellPrice:ElementRef;
	@ViewChild('currency') currency:ElementRef;
	@ViewChild('totalDemand') totalDemand:ElementRef;
	@ViewChild('submitMarketPrices') submitMarketPrices:ElementRef;
	private currentElectricityBuyPrice :number;
	private currentElectricitySellPrice :number;


 
	constructor(private hostElement: ElementRef, private graphqlService: GraphqlService, private alertService: AlertService) { }
		ngOnInit(): void {

	}

	ngAfterViewInit() {
		this.graphqlService.addSubscriberCallBack(this.onUpdate);

		this.submitMarketPrices.nativeElement.onclick = () => {this.updateMarketPrices()};
	}
	public setMarketDemand(value: number) {
		this.marketDemand.nativeElement.innerText = value.toFixed(displayValuePrecision) + " currency/J";
	}

	public setSuggestBuyPrice(value: number) {
		this.suggestBuyPrice.nativeElement.innerText = (value * Ws_per_kWh).toFixed(displayValuePrecision) + " currency/kWh";
	}

	public setSuggestSellPrice(value: number) {
		this.suggestSellPrice.nativeElement.innerText = (value * Ws_per_kWh).toFixed(displayValuePrecision) + " currency/kWh";
	}

	public setElectricityBuyPrice(value: number) {
		this.currentElectricityBuyPrice = value;
		this.electricityBuyPrice.nativeElement.innerText = (value * Ws_per_kWh).toFixed(displayValuePrecision) + " currency/kWh";
	}

	public setElectricitySellPrice(value: number) {
		this.currentElectricitySellPrice = value;
		this.electricitySellPrice.nativeElement.innerText = (value * Ws_per_kWh).toFixed(displayValuePrecision) + " currency/kWh";
	}

	public setCurrency(value: number) {
		this.currency.nativeElement.innerText = value.toFixed(displayValuePrecision);
	}

	public setTotalDemand(value: number) {
		this.totalDemand.nativeElement.innerText = value.toFixed(displayValuePrecision) + " J";
	}

	public electricityPricesMutation(buyPrice: number, sellPrice: number) {
		this.graphqlService.mutate(updateElectricityPrices, {
			electricitySellPrice: buyPrice, electricityBuyPrice: sellPrice
		}).subscribe();
	}
	
	public updateMarketPrices() {
		let newBuyPrice;
		let newSellPrice;
		if (this.newElectricityBuyPrice.nativeElement.value === "")
		newBuyPrice = this.currentElectricityBuyPrice;
		else
		newBuyPrice = parseFloat(this.newElectricityBuyPrice.nativeElement.value) / Ws_per_kWh;
		if (this.newElectricitySellPrice.nativeElement.value === "")
		newSellPrice = this.currentElectricitySellPrice;
		else
		newSellPrice = parseFloat(this.newElectricitySellPrice.nativeElement.value) / Ws_per_kWh;

		if (isNaN(newBuyPrice) || isNaN(newSellPrice)) {
				this.alertService.error("Invalid input, price update canceled", {autoClose: true});
			}
		else {
			this.electricityPricesMutation(newBuyPrice, newSellPrice);
		}
	}

	public onUpdate = (data: any) => {
		this.setCurrency(data.manager.currency);
		this.setElectricityBuyPrice(data.manager.powerPlant.electricityBuyPrice);
		this.setElectricitySellPrice(data.manager.powerPlant.electricitySellPrice);
		this.setSuggestBuyPrice(data.manager.powerPlant.modelledElectricityBuyPrice);
		this.setSuggestSellPrice(data.manager.powerPlant.modelledElectricitySellPrice);
		this.setTotalDemand(data.manager.powerPlant.totalDemand);
	}
}

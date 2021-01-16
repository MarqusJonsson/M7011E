import { Component, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import {
	PowerPlant,
	startPowerPlantProductionMutation,
	stopPowerPlantProductionMutation,
	updateElectricityPrices,
	updateProductionOutputRatioMutation
} from 'src/app/models/graphql/powerPlant';
import { AnimationData } from 'src/app/models/user/animation';
import { Ws_per_kWh } from 'src/app/models/user/electricity';
import { CURRENCY_SYMBOL, DECIMALS } from 'src/app/models/user/page-constants';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConfirmDialogService } from 'src/app/services/dialog/confirm-dialog.service';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { SiFormatterService } from 'src/app/services/stiring-format/si-formatter.service';

@Component({
	selector: 'app-power-plant-card',
	templateUrl: './power-plant-card.component.html',
	styleUrls: ['./power-plant-card.component.css', '../base-card.css']
})
export class PowerPlantCardComponent {
	@Input() isProsumer = false;
	@Input() isManager = false;
	private buyPricePerkWh: number;
	private sellPricePerkWh: number;
	public data = {
		buyPrice: '',
		sellPrice: '',
		modelledSellPrice: '',
		modelledBuyPrice: '',
		production: '',
		consumption: '',
		netProduction: '',
		totalDemand: '',
		actionDelayTimeS: '',
		actionDescripton: '',
		hasBlackout: false,
		productionFlag: true,
		productionOutputRatioSliderValue: 0.5
	};

	constructor(
		private siFormatterService: SiFormatterService,
		private dialogService: ConfirmDialogService,
		private alertService: AlertService,
		private graphqlService: GraphqlService
	) {}

	public update = (powerPlant: PowerPlant) => {
		if (this.isProsumer || this.isManager) {
			this.buyPricePerkWh = parseFloat((powerPlant.electricityBuyPrice * Ws_per_kWh).toPrecision(15));
			this.sellPricePerkWh = parseFloat((powerPlant.electricitySellPrice * Ws_per_kWh).toPrecision(15));
			this.data.buyPrice = `${this.buyPricePerkWh} ${CURRENCY_SYMBOL}/kWh`;
			this.data.sellPrice = `${this.sellPricePerkWh} ${CURRENCY_SYMBOL}/kWh`;
		}
		if (this.isManager) {
			this.data.modelledSellPrice = `${(powerPlant.modelledElectricitySellPrice * Ws_per_kWh).toFixed(DECIMALS)} ${CURRENCY_SYMBOL}/kWh`;
			this.data.modelledBuyPrice = `${(powerPlant.modelledElectricityBuyPrice * Ws_per_kWh).toFixed(DECIMALS)} ${CURRENCY_SYMBOL}/kWh`;
			this.data.production = `${this.siFormatterService.format(powerPlant.electricityProduction, DECIMALS)}Wh`;
			this.data.consumption = `${this.siFormatterService.format(powerPlant.electricityConsumption, DECIMALS)}Wh`;
			this.data.netProduction = `${this.siFormatterService.format(powerPlant.electricityProduction - powerPlant.electricityConsumption, DECIMALS)}W`;
			this.data.totalDemand = `${this.siFormatterService.format(powerPlant.totalDemand, DECIMALS)}Wh`;
			this.data.actionDelayTimeS = `${powerPlant.actionDelayTimeS.toFixed(DECIMALS)} s`;
			this.data.actionDescripton = `${powerPlant.actionDescription}`;
			this.data.hasBlackout = powerPlant.hasBlackout;
			this.data.productionFlag = powerPlant.productionFlag;
		}
	}

	public setProductionOutputRatioSliderValue(ratio: number) {
		this.data.productionOutputRatioSliderValue = ratio;
	}

	public productionOutputRatioSliderValueChange(event: MatSliderChange) {
		this.data.productionOutputRatioSliderValue = event.value;
	}

	private updateProductionOutputRatio() {
		this.graphqlService.mutate(
			updateProductionOutputRatioMutation,
			{ productionOutputRatio: this.data.productionOutputRatioSliderValue }
		).subscribe();
	}

	public mouseDownProductionOutputRatio = () => {
		document.addEventListener('mouseup', () => {
			this.updateProductionOutputRatio();
		}, { once: true });
	}

	public startProduction() {
		this.graphqlService.mutate(startPowerPlantProductionMutation).subscribe();
	}

	public stopProduction() {
		this.graphqlService.mutate(stopPowerPlantProductionMutation).subscribe();
	}

	public openUpdatePricesDialog() {
		const content = document.createElement('div');

		const buyPriceContainer = document.createElement('div');
		const buyPriceLabel = document.createElement('span');
		buyPriceLabel.innerText = 'Buy price: ';
		const buyPriceInput = document.createElement('input');
		buyPriceInput.value = `${this.buyPricePerkWh}`;
		const buyPriceUnit = document.createElement('span');
		buyPriceUnit.innerText = ` ${CURRENCY_SYMBOL}/kWh`;
		buyPriceContainer.appendChild(buyPriceLabel);
		buyPriceContainer.appendChild(buyPriceInput);
		buyPriceContainer.appendChild(buyPriceUnit);

		const sellPriceContainer = document.createElement('div');
		const sellPriceLabel = document.createElement('span');
		sellPriceLabel.innerText = 'Sell price: ';
		const sellPriceInput = document.createElement('input');
		sellPriceInput.value = `${this.sellPricePerkWh}`;
		const sellPriceUnit = document.createElement('span');
		sellPriceUnit.innerText = ` ${CURRENCY_SYMBOL}/kWh`;
		sellPriceContainer.appendChild(sellPriceLabel);
		sellPriceContainer.appendChild(sellPriceInput);
		sellPriceContainer.appendChild(sellPriceUnit);

		content.appendChild(buyPriceContainer);
		content.appendChild(sellPriceContainer);

		const dialogData = {
			title: `Set new market prices`,
			message: '',
			cancelText: 'Cancel',
			confirmText: 'Confirm',
			extraField: content
		};

		this.dialogService.open(dialogData);
		this.dialogService.confirmed().subscribe(confirmed => {
			if (confirmed) {
				const buyPrice = parseFloat(buyPriceInput.value);
				const sellPrice = parseFloat(sellPriceInput.value);
				if (!isNaN(buyPrice) && !isNaN(sellPrice)) {
					this.updateElectricityPrices(buyPrice / Ws_per_kWh, sellPrice / Ws_per_kWh);
				} else {
					this.alertService.error('Invalid input, price update canceled', { autoClose: true });
				}
			}
		});
	}

	private updateElectricityPrices(buyPrice: number, sellPrice: number) {
		this.graphqlService.mutate(updateElectricityPrices, {
			electricitySellPrice: buyPrice, electricityBuyPrice: sellPrice
		}).subscribe();
	}
}

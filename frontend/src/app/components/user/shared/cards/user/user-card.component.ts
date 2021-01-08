import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CURRENCY_SYMBOL } from 'src/app/models/user/page-constants';
import { SiFormatterService } from 'src/app/services/stiring-format/si-formatter.service';

@Component({
	selector: 'app-user-card',
	templateUrl: './user-card.component.html',
	styleUrls: ['./user-card.component.css', '../base-card.css']
})
export class UserCardComponent {
	@ViewChild('currencyText') private currencyText: ElementRef<HTMLElement> | undefined;

	constructor(
		private siFormatterService: SiFormatterService
	) {}

	public update = (currency: number) => {
		this.currencyText.nativeElement.innerText = `${this.siFormatterService.format(currency, 9)} ${CURRENCY_SYMBOL}`;
	}
}

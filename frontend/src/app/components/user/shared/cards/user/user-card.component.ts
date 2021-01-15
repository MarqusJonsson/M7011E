import { Component, Input } from '@angular/core';
import { CURRENCY_SYMBOL } from 'src/app/models/user/page-constants';
import { SiFormatterService } from 'src/app/services/stiring-format/si-formatter.service';

@Component({
	selector: 'app-user-card',
	templateUrl: './user-card.component.html',
	styleUrls: ['./user-card.component.css', '../base-card.css']
})
export class UserCardComponent {
	@Input() isProsumer = false;
	@Input() profilePictureUserId: number;

	public data = {
		currency: '',
		isBlocked: false
	};

	constructor(
		private siFormatterService: SiFormatterService
	) {}

	public update = (currency: number, isBlocked = false) => {
		this.data.currency = `${this.siFormatterService.format(currency, 9)} ${CURRENCY_SYMBOL}`;
		this.data.isBlocked = isBlocked;
	}
}

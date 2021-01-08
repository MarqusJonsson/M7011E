import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SiFormatterService {
	private static readonly SI_SYMBOLS = [
		{ value: 1e-3, symbol: 'm' },
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'k' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'G' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e18, symbol: 'E' }
	];

	constructor() {}

	public format(num: number, digits: number) {
		if (num === 0) { return '0 '; }
		const sign = Math.sign(num);
		num = Math.abs(num);
		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		let i: number;
		for (i = SiFormatterService.SI_SYMBOLS.length - 1; i > 0; i--) {
			if (num >= SiFormatterService.SI_SYMBOLS[i].value) {
				break;
			}
		}
		return (sign < 0 ? '-' : '') // Sign
			+ (num / SiFormatterService.SI_SYMBOLS[i].value).toFixed(digits).replace(rx, '$1') // Mumber
			+ ' ' + SiFormatterService.SI_SYMBOLS[i].symbol; // SI symbol
	}
}

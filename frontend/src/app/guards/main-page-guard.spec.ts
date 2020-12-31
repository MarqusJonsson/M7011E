import { TestBed } from '@angular/core/testing';

import { MainPageGuard } from './main-page.guard';

describe('MainPageGuard', () => {
	let guard: MainPageGuard;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		guard = TestBed.inject(MainPageGuard);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerMarketComponent } from './manager-market.component';

describe('ManagerMarketComponent', () => {
	let component: ManagerMarketComponent;
	let fixture: ComponentFixture<ManagerMarketComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ManagerMarketComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ManagerMarketComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

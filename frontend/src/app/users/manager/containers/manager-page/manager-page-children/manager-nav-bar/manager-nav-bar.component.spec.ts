import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerNavBarComponent } from './manager-nav-bar.component';

describe('ManagerNavBarComponent', () => {
	let component: ManagerNavBarComponent;
	let fixture: ComponentFixture<ManagerNavBarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ManagerNavBarComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ManagerNavBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageButtonComponent } from './user-page-button.component';

describe('UserPageButtonComponent', () => {
	let component: UserPageButtonComponent;
	let fixture: ComponentFixture<UserPageButtonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ UserPageButtonComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserPageButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

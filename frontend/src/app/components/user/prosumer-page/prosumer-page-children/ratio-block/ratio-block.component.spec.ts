import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatioBlockComponent } from './ratio-block.component';

describe('RatioBlockComponent', () => {
	let component: RatioBlockComponent;
	let fixture: ComponentFixture<RatioBlockComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ RatioBlockComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RatioBlockComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

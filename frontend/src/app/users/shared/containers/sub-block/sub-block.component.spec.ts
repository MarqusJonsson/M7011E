import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBlockComponent } from './sub-block.component';

describe('SubBlockComponent', () => {
	let component: SubBlockComponent;
	let fixture: ComponentFixture<SubBlockComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SubBlockComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubBlockComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerPlantBlockComponent } from './power-plant-block.component';

describe('PowerPlantBlockComponent', () => {
  let component: PowerPlantBlockComponent;
  let fixture: ComponentFixture<PowerPlantBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerPlantBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerPlantBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

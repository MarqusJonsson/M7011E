import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsumerCurrencyBlockComponent } from './prosumer-currency-block.component';

describe('ProsumerCurrencyBlockComponent', () => {
  let component: ProsumerCurrencyBlockComponent;
  let fixture: ComponentFixture<ProsumerCurrencyBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsumerCurrencyBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsumerCurrencyBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

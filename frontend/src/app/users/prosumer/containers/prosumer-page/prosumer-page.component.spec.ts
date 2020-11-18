import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsumerPageComponent } from './prosumer-page.component';

describe('ProsumerPageComponent', () => {
  let component: ProsumerPageComponent;
  let fixture: ComponentFixture<ProsumerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsumerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsumerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

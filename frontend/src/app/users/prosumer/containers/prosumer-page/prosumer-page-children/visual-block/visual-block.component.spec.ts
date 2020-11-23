import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualBlockComponent } from './visual-block.component';

describe('VisualBlockComponent', () => {
  let component: VisualBlockComponent;
  let fixture: ComponentFixture<VisualBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerMainBlockComponent } from './manager-main-block.component';

describe('ManagerMainBlockComponent', () => {
  let component: ManagerMainBlockComponent;
  let fixture: ComponentFixture<ManagerMainBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerMainBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerMainBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

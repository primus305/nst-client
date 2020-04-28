import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HallPanelComponent } from './hall-panel.component';

describe('HallPanelComponent', () => {
  let component: HallPanelComponent;
  let fixture: ComponentFixture<HallPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HallPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HallPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

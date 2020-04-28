import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerPanelComponent } from './speaker-panel.component';

describe('SpeakerPanelComponent', () => {
  let component: SpeakerPanelComponent;
  let fixture: ComponentFixture<SpeakerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsOffcanvasComponent } from './settings-offcanvas.component';

describe('SettingsOffcanvasComponent', () => {
  let component: SettingsOffcanvasComponent;
  let fixture: ComponentFixture<SettingsOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsOffcanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

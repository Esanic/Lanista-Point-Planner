import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendEquipmentSwitchComponent } from './legend-equipment-switch.component';

describe('LegendEquipmentSwitchComponent', () => {
  let component: LegendEquipmentSwitchComponent;
  let fixture: ComponentFixture<LegendEquipmentSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegendEquipmentSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegendEquipmentSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

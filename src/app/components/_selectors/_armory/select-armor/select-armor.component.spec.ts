import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectArmorComponent } from './select-armor.component';

describe('SelectArmorComponent', () => {
  let component: SelectArmorComponent;
  let fixture: ComponentFixture<SelectArmorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectArmorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectArmorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

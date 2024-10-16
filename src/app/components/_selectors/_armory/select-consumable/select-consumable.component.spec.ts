import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConsumableComponent } from './select-consumable.component';

describe('SelectConsumableComponent', () => {
  let component: SelectConsumableComponent;
  let fixture: ComponentFixture<SelectConsumableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectConsumableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectConsumableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEnchantComponent } from './select-enchant.component';

describe('SelectEnchantComponent', () => {
  let component: SelectEnchantComponent;
  let fixture: ComponentFixture<SelectEnchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectEnchantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectEnchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHeadArmorComponent } from './select-head-armor.component';

describe('SelectHeadArmorComponent', () => {
  let component: SelectHeadArmorComponent;
  let fixture: ComponentFixture<SelectHeadArmorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectHeadArmorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectHeadArmorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

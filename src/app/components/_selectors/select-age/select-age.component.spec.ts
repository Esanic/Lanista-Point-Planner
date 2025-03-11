import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAgeComponent } from './select-age.component';

describe('SelectAgeComponent', () => {
  let component: SelectAgeComponent;
  let fixture: ComponentFixture<SelectAgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

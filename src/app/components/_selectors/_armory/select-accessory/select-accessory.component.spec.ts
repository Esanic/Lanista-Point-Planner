import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAccessoryComponent } from './select-accessory.component';

describe('SelectAccessoryComponent', () => {
  let component: SelectAccessoryComponent;
  let fixture: ComponentFixture<SelectAccessoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAccessoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectAccessoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

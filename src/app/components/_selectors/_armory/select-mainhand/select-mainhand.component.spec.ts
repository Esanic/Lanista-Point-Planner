import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMainhandComponent } from './select-mainhand.component';

describe('SelectMainhandComponent', () => {
  let component: SelectMainhandComponent;
  let fixture: ComponentFixture<SelectMainhandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMainhandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectMainhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

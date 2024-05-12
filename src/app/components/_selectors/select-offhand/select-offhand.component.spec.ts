import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOffhandComponent } from './select-offhand.component';

describe('SelectOffhandComponent', () => {
  let component: SelectOffhandComponent;
  let fixture: ComponentFixture<SelectOffhandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOffhandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectOffhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

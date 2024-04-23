import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WipeButtonComponent } from './wipe-button.component';

describe('WipeButtonComponent', () => {
  let component: WipeButtonComponent;
  let fixture: ComponentFixture<WipeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WipeButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WipeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

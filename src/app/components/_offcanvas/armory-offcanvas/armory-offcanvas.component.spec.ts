import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmoryOffcanvasComponent } from './armory-offcanvas.component';

describe('ArmoryOffcanvasComponent', () => {
  let component: ArmoryOffcanvasComponent;
  let fixture: ComponentFixture<ArmoryOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmoryOffcanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmoryOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

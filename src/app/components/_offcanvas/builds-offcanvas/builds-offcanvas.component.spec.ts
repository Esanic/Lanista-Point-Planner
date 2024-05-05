import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildsOffcanvasComponent } from './builds-offcanvas.component';

describe('BuildsOffcanvasComponent', () => {
  let component: BuildsOffcanvasComponent;
  let fixture: ComponentFixture<BuildsOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildsOffcanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildsOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

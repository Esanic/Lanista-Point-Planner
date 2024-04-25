import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildNameModalComponent } from './build-name-modal.component';

describe('BuildNameModalComponent', () => {
  let component: BuildNameModalComponent;
  let fixture: ComponentFixture<BuildNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildNameModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

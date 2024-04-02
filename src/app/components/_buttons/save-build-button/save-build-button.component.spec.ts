import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveBuildButtonComponent } from './save-build-button.component';

describe('SaveBuildButtonComponent', () => {
  let component: SaveBuildButtonComponent;
  let fixture: ComponentFixture<SaveBuildButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveBuildButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveBuildButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

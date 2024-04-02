import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBuildButtonComponent } from './delete-build-button.component';

describe('DeleteBuildButtonComponent', () => {
  let component: DeleteBuildButtonComponent;
  let fixture: ComponentFixture<DeleteBuildButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBuildButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteBuildButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

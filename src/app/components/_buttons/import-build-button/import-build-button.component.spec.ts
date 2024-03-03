import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBuildButtonComponent } from './import-build-button.component';

describe('ImportBuildButtonComponent', () => {
  let component: ImportBuildButtonComponent;
  let fixture: ComponentFixture<ImportBuildButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportBuildButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportBuildButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

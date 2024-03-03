import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBuildButtonComponent } from './export-build-button.component';

describe('ExportBuildComponent', () => {
  let component: ExportBuildButtonComponent;
  let fixture: ComponentFixture<ExportBuildButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportBuildButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportBuildButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

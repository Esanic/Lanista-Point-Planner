import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBuildComponent } from './export-build.component';

describe('ExportBuildComponent', () => {
  let component: ExportBuildComponent;
  let fixture: ComponentFixture<ExportBuildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportBuildComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportBuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

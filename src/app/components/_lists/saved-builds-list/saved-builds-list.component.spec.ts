import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedBuildsListComponent } from './saved-builds-list.component';

describe('SavedBuildsListComponent', () => {
  let component: SavedBuildsListComponent;
  let fixture: ComponentFixture<SavedBuildsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedBuildsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedBuildsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

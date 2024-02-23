import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWeaponSkillComponent } from './select-weapon-skill.component';

describe('SelectWeaponSkillComponent', () => {
  let component: SelectWeaponSkillComponent;
  let fixture: ComponentFixture<SelectWeaponSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectWeaponSkillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectWeaponSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

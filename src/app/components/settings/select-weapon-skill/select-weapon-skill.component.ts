import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../../../support/services/global.service';
import {MatSelectModule} from '@angular/material/select'; 

@Component({
  selector: 'select-weapon-skill',
  standalone: true,
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './select-weapon-skill.component.html',
  styleUrl: './select-weapon-skill.component.css'
})
export class SelectWeaponSkillComponent {
  public chooseWeaponSkill = new FormControl('');
  public weaponSkills: string[] = this.global.weaponSkills;

  constructor(private global: GlobalService){
    this.chooseWeaponSkill.valueChanges.subscribe(weaponSkill => {
      if(weaponSkill)
        this.global.setChosenWeaponSkill(weaponSkill);
    })
  }
}

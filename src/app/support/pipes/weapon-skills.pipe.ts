import { Pipe, PipeTransform } from '@angular/core';
import { weaponSkillStr, weaponSkills } from '../enums/weapon-skills.enums';

@Pipe({
  name: 'weaponSkills',
  standalone: true,
})
export class WeaponSkillsPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case weaponSkills.Axe:
        return weaponSkillStr.Axe;
      case weaponSkills.Sword:
        return weaponSkillStr.Sword;
      case weaponSkills.Mace:
        return weaponSkillStr.Mace;
      case weaponSkills.Stave:
        return weaponSkillStr.Stave;
      case weaponSkills.Shield:
        return weaponSkillStr.Shield;
      case weaponSkills.Spear:
        return weaponSkillStr.Spear;
      case weaponSkills.Chain:
        return weaponSkillStr.Chain;
      default:
        return '';
    }
  }
}

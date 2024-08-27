import { Injectable } from '@angular/core';
import { weaponSkillStr } from '../enums/weapon-skills.enums';
import { ITotalBonus, IBonus } from '../interfaces/_armory/bonus';
import { IEquipment } from '../interfaces/_armory/equipment';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class ArmoryHelper {
  constructor(private globalService: GlobalService) {}

  public calculateBonusesFromEquipment(equipment: IEquipment, selectedWeaponSkill?: string): ITotalBonus {
    const weaponSkillEnums = [weaponSkillStr.Axe, weaponSkillStr.Sword, weaponSkillStr.Mace, weaponSkillStr.Stave, weaponSkillStr.Spear, weaponSkillStr.Chain];
    const weaponSkillTypes = ['axe', 'sword', 'mace', 'stave', 'spear', 'chain'];
    let multiplierBonus: IBonus = { ...this.globalService.multiplierBonusTemplate };
    let additiveBonus: IBonus = { ...this.globalService.additiveBonusTemplate };

    equipment.bonuses.forEach((bonus) => {
      if (bonus.additive !== undefined) {
        if (selectedWeaponSkill) {
          const index = weaponSkillTypes.findIndex((type) => type.toLowerCase() === bonus.type.toLowerCase());
          if (index !== -1 && selectedWeaponSkill === weaponSkillEnums[index]) {
            additiveBonus.weaponSkill += bonus.additive;
          }
        }

        switch (bonus.type.toLowerCase()) {
          case 'stamina':
            additiveBonus.stamina += bonus.additive;
            break;
          case 'strength':
            additiveBonus.strength += bonus.additive;
            break;
          case 'endurance':
            additiveBonus.endurance += bonus.additive;
            break;
          case 'initiative':
            additiveBonus.initiative += bonus.additive;
            break;
          case 'dodge':
            additiveBonus.dodge += bonus.additive;
            break;
          case 'shield':
            additiveBonus.shield += bonus.additive;
            break;
          default:
            break;
        }
      }

      if (bonus.multiplier !== undefined) {
        if (selectedWeaponSkill) {
          const index = weaponSkillTypes.findIndex((type) => type.toLowerCase() === bonus.type.toLowerCase());
          if (index !== -1 && selectedWeaponSkill === weaponSkillEnums[index]) {
            multiplierBonus.weaponSkill += bonus.multiplier - 1;
          }
        }

        switch (bonus.type.toLowerCase()) {
          case 'stamina':
            multiplierBonus.stamina += bonus.multiplier - 1;
            break;
          case 'strength':
            multiplierBonus.strength += bonus.multiplier - 1;
            break;
          case 'endurance':
            multiplierBonus.endurance += bonus.multiplier - 1;
            break;
          case 'initiative':
            multiplierBonus.initiative += bonus.multiplier - 1;
            break;
          case 'dodge':
            multiplierBonus.dodge += bonus.multiplier - 1;
            break;
          case 'shield':
            multiplierBonus.shield += bonus.multiplier - 1;
            break;
          default:
            break;
        }
      }
    });

    return { additiveBonus, multiplierBonus };
  }
}

import { Injectable } from '@angular/core';
import { weaponSkillStr, weaponSkills } from '../enums/weapon-skills.enums';
import { ITotalBonus, IBonus } from '../interfaces/_armory/bonus';
import { IEquipment } from '../interfaces/_armory/equipment';
import { additiveBonus, multiplierBonus } from '../constants/templates';

@Injectable({
  providedIn: 'root',
})
export class ArmoryHelper {
  constructor() {}

  public calculateBonusesFromEquipment(equipment: IEquipment, selectedWeaponSkill?: number): ITotalBonus {
    // const weaponSkillEnums = [weaponSkillStr.Axe, weaponSkillStr.Sword, weaponSkillStr.Mace, weaponSkillStr.Stave, weaponSkillStr.Spear, weaponSkillStr.Chain];
    // const weaponSkillTypes = ['axe', 'sword', 'mace', 'stave', 'spear', 'chain'];
    let multiplierBonuses: IBonus = { ...multiplierBonus };
    let additiveBonuses: IBonus = { ...additiveBonus };

    equipment.bonuses.forEach((bonus) => {
      if (bonus.additive !== undefined) {
        if (selectedWeaponSkill) {
          additiveBonuses.weaponSkill += bonus.additive;
          // const index = weaponSkillTypes.findIndex((type) => type.toLowerCase() === bonus.type.toLowerCase());
          // if (index !== -1 && selectedWeaponSkill === weaponSkillEnums[index]) {
          //   additiveBonuses.weaponSkill += bonus.additive;
          // }
        }

        switch (bonus.type.toLowerCase()) {
          case 'stamina':
            additiveBonuses.stamina += bonus.additive;
            break;
          case 'strength':
            additiveBonuses.strength += bonus.additive;
            break;
          case 'endurance':
            additiveBonuses.endurance += bonus.additive;
            break;
          case 'initiative':
            additiveBonuses.initiative += bonus.additive;
            break;
          case 'dodge':
            additiveBonuses.dodge += bonus.additive;
            break;
          case 'shield':
            additiveBonuses.shield += bonus.additive;
            break;
          default:
            break;
        }
      }

      if (bonus.multiplier !== undefined) {
        if (selectedWeaponSkill) {
          multiplierBonuses.weaponSkill += bonus.multiplier - 1;
          // const index = weaponSkillTypes.findIndex((type) => type.toLowerCase() === bonus.type.toLowerCase());
          // if (index !== -1 && selectedWeaponSkill === weaponSkillEnums[index]) {
          //   multiplierBonuses.weaponSkill += bonus.multiplier - 1;
          // }
        }

        switch (bonus.type.toLowerCase()) {
          case 'stamina':
            multiplierBonuses.stamina += bonus.multiplier - 1;
            break;
          case 'strength':
            multiplierBonuses.strength += bonus.multiplier - 1;
            break;
          case 'endurance':
            multiplierBonuses.endurance += bonus.multiplier - 1;
            break;
          case 'initiative':
            multiplierBonuses.initiative += bonus.multiplier - 1;
            break;
          case 'dodge':
            multiplierBonuses.dodge += bonus.multiplier - 1;
            break;
          case 'shield':
            multiplierBonuses.shield += bonus.multiplier - 1;
            break;
          default:
            break;
        }
      }
    });

    return { additiveBonus: additiveBonuses, multiplierBonus: multiplierBonuses };
  }

  public convertWeaponSkillToId(weaponSkill: string): number {
    switch (weaponSkill.toLowerCase()) {
      case 'axe':
      case 'yxa':
        return weaponSkills.Axe;
      case 'sword':
      case 'svärd':
        return weaponSkills.Sword;
      case 'mace':
      case 'hammare':
        return weaponSkills.Mace;
      case 'stave':
      case 'stav':
        return weaponSkills.Stave;
      case 'spear':
      case 'stick':
        return weaponSkills.Spear;
      case 'chain':
      case 'kätting':
        return weaponSkills.Chain;
      default:
        return 0;
    }
  }

  public convertWeaponSkillIdToName(weaponSkill: number): string {
    switch (weaponSkill) {
      case weaponSkills.Axe:
        return weaponSkillStr.Axe;
      case weaponSkills.Sword:
        return weaponSkillStr.Sword;
      case weaponSkills.Mace:
        return weaponSkillStr.Mace;
      case weaponSkills.Stave:
        return weaponSkillStr.Stave;
      case weaponSkills.Spear:
        return weaponSkillStr.Spear;
      case weaponSkills.Chain:
        return weaponSkillStr.Chain;
      default:
        return '';
    }
  }
}

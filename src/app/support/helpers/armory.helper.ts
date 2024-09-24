import { Injectable } from '@angular/core';
import { weaponSkillStr, weaponSkillsNum } from '../enums/weapon-skills.enums';
import { ITotalBonus, IBonus } from '../interfaces/_armory/bonus';
import { IEquipment } from '../interfaces/_armory/equipment';
import { additiveBonus, multiplierBonus } from '../constants/templates';

@Injectable({
  providedIn: 'root',
})
export class ArmoryHelper {
  constructor() {}

  public calculateBonusesFromEquipment(equipment: IEquipment, selectedWeaponSkill?: string): ITotalBonus {
    const weaponSkillEnums = [weaponSkillStr.Axe, weaponSkillStr.Sword, weaponSkillStr.Mace, weaponSkillStr.Stave, weaponSkillStr.Spear, weaponSkillStr.Chain];
    const weaponSkillTypes = ['axe', 'sword', 'mace', 'stave', 'spear', 'chain'];
    let multiplierBonuses: IBonus = { ...multiplierBonus };
    let additiveBonuses: IBonus = { ...additiveBonus };

    equipment.bonuses.forEach((bonus) => {
      if (bonus.additive !== undefined) {
        if (selectedWeaponSkill) {
          const index = weaponSkillTypes.findIndex((type) => type.toLowerCase() === bonus.type.toLowerCase());
          if (index !== -1 && selectedWeaponSkill === weaponSkillEnums[index]) {
            additiveBonuses.weaponSkill += bonus.additive;
          }
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
          const index = weaponSkillTypes.findIndex((type) => type.toLowerCase() === bonus.type.toLowerCase());
          if (index !== -1 && selectedWeaponSkill === weaponSkillEnums[index]) {
            multiplierBonuses.weaponSkill += bonus.multiplier - 1;
          }
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

  public convertWeaponSkillToEnum(weaponSkill: string): number {
    switch (weaponSkill.toLowerCase()) {
      case 'axe':
      case 'yxa':
        return weaponSkillsNum.Axe;
      case 'sword':
      case 'svärd':
        return weaponSkillsNum.Sword;
      case 'mace':
      case 'hammare':
        return weaponSkillsNum.Mace;
      case 'stave':
      case 'stav':
        return weaponSkillsNum.Stave;
      case 'spear':
      case 'stick':
        return weaponSkillsNum.Spear;
      case 'chain':
      case 'kätting':
        return weaponSkillsNum.Chain;
      default:
        return 0;
    }
  }
}

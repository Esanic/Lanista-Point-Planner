import { emptyString } from '../constants/common';
import { additiveBonus, multiplierBonus } from '../constants/templates';
import { weaponSkillsNames } from '../constants/weaponSkills';
import { weaponSkillStr, weaponSkills } from '../enums/weapon-skills.enums';
import { IBonus, ITotalBonus } from '../interfaces/_armory/bonus';
import { IEquipment } from '../interfaces/_armory/equipment';
import { IGear, IGearNames } from '../interfaces/_armory/gear';

export const calculateBonusesFromEquipment = (equipment: IEquipment, selectedWeaponSkill?: number): ITotalBonus => {
  const additiveBonuses: IBonus = { ...additiveBonus };
  const multiplierBonuses: IBonus = { ...multiplierBonus };
  const weaponSkillTypes = ['axe', 'sword', 'mace', 'stave', 'spear', 'chain'];

  equipment.bonuses.forEach((bonus) => {
    // If bonus is of type null, it is not a bonus that should be calculated - Example is "Lärlingshandskar".
    if (bonus.type === null) {
      return;
    }

    if (bonus.additive !== undefined) {
      if (selectedWeaponSkill !== undefined && weaponSkillTypes.includes(bonus.type.toLowerCase())) {
        additiveBonuses.weaponSkill += bonus.additive;
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
      if (selectedWeaponSkill !== undefined && weaponSkillTypes.includes(bonus.type.toLowerCase())) {
        multiplierBonuses.weaponSkill += bonus.multiplier - 1;
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
};

export const convertWeaponSkillIdToName = (weaponSkill: number): string => {
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
};

export const convertWeaponSkillNameToId = (weaponSkill: string): number => {
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
      return -1;
  }
};

export const getGearNamesObject = (gear: IGear): IGearNames => {
  return {
    mainhand: gear['mainhand'].name.split('(')[0].trimEnd() ?? emptyString,
    offhand: gear['offhand'].name.split('(')[0].trimEnd() ?? emptyString,
    head: gear['head'].name.split('(')[0].trimEnd() ?? emptyString,
    shoulders: gear['shoulders'].name.split('(')[0].trimEnd() ?? emptyString,
    chest: gear['chest'].name.split('(')[0].trimEnd() ?? emptyString,
    gloves: gear['gloves'].name.split('(')[0].trimEnd() ?? emptyString,
    legs: gear['legs'].name.split('(')[0].trimEnd() ?? emptyString,
    boots: gear['boots'].name.split('(')[0].trimEnd() ?? emptyString,
    cloak: gear['cloak'].name.split('(')[0].trimEnd() ?? emptyString,
    necklace: gear['necklace'].name.split('(')[0].trimEnd() ?? emptyString,
    ring: gear['ring'].name.split('(')[0].trimEnd() ?? emptyString,
    amulet: gear['amulet'].name.split('(')[0].trimEnd() ?? emptyString,
    bracelet: gear['bracelet'].name.split('(')[0].trimEnd() ?? emptyString,
    trinket: gear['trinket'].name.split('(')[0].trimEnd() ?? emptyString,
    consumableOne: gear['consumableOne'].name.split('(')[0].trimEnd() ?? emptyString,
    consumableTwo: gear['consumableTwo'].name.split('(')[0].trimEnd() ?? emptyString,
    consumableThree: gear['consumableThree'].name.split('(')[0].trimEnd() ?? emptyString,
    enchantOne: gear['enchantOne'].name.split('(')[0].trimEnd() ?? emptyString,
    enchantTwo: gear['enchantTwo'].name.split('(')[0].trimEnd() ?? emptyString,
  };
};

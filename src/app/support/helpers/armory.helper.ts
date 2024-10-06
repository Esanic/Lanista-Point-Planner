import { additiveBonus, multiplierBonus } from '../constants/templates';
import { weaponSkillsNames } from '../constants/weaponSkills';
import { weaponSkillStr, weaponSkills } from '../enums/weapon-skills.enums';
import { IBonus, ITotalBonus } from '../interfaces/_armory/bonus';
import { IEquipment } from '../interfaces/_armory/equipment';
import { IGear } from '../interfaces/_armory/gear';

export const calculateBonusesFromEquipment = (equipment: IEquipment, selectedWeaponSkill?: number): ITotalBonus => {
  const additiveBonuses: IBonus = { ...additiveBonus };
  const multiplierBonuses: IBonus = { ...multiplierBonus };
  const weaponSkillTypes = ['axe', 'sword', 'mace', 'stave', 'spear', 'chain'];

  equipment.bonuses.forEach((bonus) => {
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
    case 'klubba':
      return weaponSkills.Mace;
    case 'stave':
    case 'stav':
      return weaponSkills.Stave;
    case 'spear':
    case 'spjut':
      return weaponSkills.Spear;
    case 'chain':
    case 'kedja':
      return weaponSkills.Chain;
    default:
      return -1;
  }
};

export const getGearNamesObject = (gear: IGear): object => {
  return {
    mainhand: gear['mainhand'].name.split('(')[0].trimEnd(),
    offhand: gear['offhand'].name.split('(')[0].trimEnd(),
    head: gear['head'].name.split('(')[0].trimEnd(),
    shoulders: gear['shoulders'].name.split('(')[0].trimEnd(),
    chest: gear['chest'].name.split('(')[0].trimEnd(),
    gloves: gear['gloves'].name.split('(')[0].trimEnd(),
    legs: gear['legs'].name.split('(')[0].trimEnd(),
    boots: gear['boots'].name.split('(')[0].trimEnd(),
    cloak: gear['cloak'].name.split('(')[0].trimEnd(),
    necklace: gear['necklace'].name.split('(')[0].trimEnd(),
    ring: gear['ring'].name.split('(')[0].trimEnd(),
    amulet: gear['amulet'].name.split('(')[0].trimEnd(),
    bracelet: gear['bracelet'].name.split('(')[0].trimEnd(),
    trinket: gear['trinket'].name.split('(')[0].trimEnd(),
    consumableOne: gear['consumableOne'].name.split('(')[0].trimEnd(),
    consumableTwo: gear['consumableTwo'].name.split('(')[0].trimEnd(),
    consumableThree: gear['consumableThree'].name.split('(')[0].trimEnd(),
    enchantOne: gear['enchantOne'].name.split('(')[0].trimEnd(),
    enchantTwo: gear['enchantTwo'].name.split('(')[0].trimEnd(),
  };
};

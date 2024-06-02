import { Injectable } from '@angular/core';
import { IRace } from '../interfaces/race';
import { weaponSkillsNum } from '../enums/weapon-skills.enums';
import { IWeapon } from '../interfaces/_armory/weapon';
import { IBonus } from '../interfaces/_armory/bonus';
import { ITotal } from '../interfaces/total';
import { IEquipmentBonus } from '../interfaces/_armory/equipmentBonus';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public defaultRace: IRace = {
    name: 'Default',
    baseWeight: 0,
    damageWithShield: 1,
    critChances: { baseCrit: 1, baseMaxCrit: 1, maxDamage: 1 },
    stats: { stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, learningCapacity: 1, luck: 1, discipline: 1 },
    weaponSkills: { axe: 1, sword: 1, mace: 1, stave: 1, shield: 1, spear: 1, chain: 1 },
  };
  public human: IRace = {
    name: 'Människa',
    baseWeight: 5,
    damageWithShield: 0.85,
    critChances: { baseCrit: 1.05, baseMaxCrit: 1.11, maxDamage: 1.2 },
    stats: { stamina: 1.1, strength: 1.1, endurance: 1.1, initiative: 1.1, dodge: 1.1, learningCapacity: 1.1, luck: 1.1, discipline: 1.1 },
    weaponSkills: { axe: 1.2, sword: 1.2, mace: 1.1, stave: 1.1, shield: 1.1, spear: 1.1, chain: 1.1 },
  };
  public elf: IRace = {
    name: 'Alv',
    baseWeight: 0,
    damageWithShield: 0.8,
    critChances: { baseCrit: 1, baseMaxCrit: 1.1, maxDamage: 1.2 },
    stats: { stamina: 0.9, strength: 0.9, endurance: 1.3, initiative: 1.25, dodge: 1.55, learningCapacity: 1.2, luck: 1.1, discipline: 1 },
    weaponSkills: { axe: 1, sword: 1.15, mace: 1, stave: 1.2, shield: 1.25, spear: 1.3, chain: 1 },
  };
  public dwarf: IRace = {
    name: 'Dvärg',
    baseWeight: 4,
    damageWithShield: 0.95,
    critChances: { baseCrit: 1.05, baseMaxCrit: 1.11, maxDamage: 1.2 },
    stats: { stamina: 1.3, strength: 1.2, endurance: 0.9, initiative: 0.85, dodge: 0.6, learningCapacity: 1.1, luck: 1, discipline: 1.2 },
    weaponSkills: { axe: 1.2, sword: 1, mace: 1.2, stave: 0.85, shield: 1.1, spear: 0.9, chain: 1 },
  };
  public orc: IRace = {
    name: 'Ork',
    baseWeight: 7,
    damageWithShield: 1,
    critChances: { baseCrit: 1, baseMaxCrit: 1.09, maxDamage: 1.27 },
    stats: { stamina: 1.2, strength: 1.3, endurance: 1, initiative: 0.95, dodge: 0.7, learningCapacity: 0.9, luck: 1.05, discipline: 1.15 },
    weaponSkills: { axe: 1.1, sword: 1, mace: 1.1, stave: 0.85, shield: 0.95, spear: 1, chain: 1.1 },
  };
  public goblin: IRace = {
    name: 'Goblin',
    baseWeight: 2,
    damageWithShield: 0.85,
    critChances: { baseCrit: 1, baseMaxCrit: 1.08, maxDamage: 1.2 },
    stats: { stamina: 0.85, strength: 1.2, endurance: 1, initiative: 1.1, dodge: 1.3, learningCapacity: 1, luck: 1.2, discipline: 1 },
    weaponSkills: { axe: 1, sword: 0.9, mace: 1.2, stave: 1.15, shield: 1, spear: 1.2, chain: 1.1 },
  };
  public troll: IRace = {
    name: 'Troll',
    baseWeight: 12,
    damageWithShield: 0.9,
    critChances: { baseCrit: 1, baseMaxCrit: 1.07, maxDamage: 1.24 },
    stats: { stamina: 1.5, strength: 1.5, endurance: 0.8, initiative: 0.6, dodge: 0.4, learningCapacity: 0.8, luck: 1.15, discipline: 1.05 },
    weaponSkills: { axe: 0.8, sword: 0.7, mace: 0.85, stave: 0.65, shield: 0.8, spear: 0.75, chain: 0.85 },
  };
  public undead: IRace = {
    name: 'Odöd',
    baseWeight: 2,
    damageWithShield: 0.85,
    critChances: { baseCrit: 1.02, baseMaxCrit: 1.09, maxDamage: 1.2 },
    stats: { stamina: 1.1, strength: 1, endurance: 2, initiative: 0.9, dodge: 1.05, learningCapacity: 0.6, luck: 0.8, discipline: 1.3 },
    weaponSkills: { axe: 1.05, sword: 1.05, mace: 1.05, stave: 1.05, shield: 1.05, spear: 1.05, chain: 1.05 },
  };
  public salamanth: IRace = {
    name: 'Salamanth',
    baseWeight: 2,
    damageWithShield: 0.85,
    critChances: { baseCrit: 1.02, baseMaxCrit: 1.09, maxDamage: 1.2 },
    stats: { stamina: 1.1, strength: 1, endurance: 2, initiative: 0.9, dodge: 1.05, learningCapacity: 0.6, luck: 0.8, discipline: 1.3 },
    weaponSkills: { axe: 1.05, sword: 1.05, mace: 1.05, stave: 1.05, shield: 1.05, spear: 1.05, chain: 1.05 },
  };
  public races: IRace[] = [this.human, this.elf, this.dwarf, this.orc, this.troll, this.goblin, this.undead, this.salamanth];

  public headers: string[] = ['Grad', 'KP', 'SB', 'UTH', 'INI', 'UA', 'VF', 'Sköld', 'INL', 'Tur', 'DISC', 'Utplacerade Poäng'];
  public weaponSkills: string[] = ['Yxa', 'Svärd', 'Hammare', 'Stav', 'Stick', 'Kätting'];
  public WeaponSkills: number[] = [weaponSkillsNum.Axe, weaponSkillsNum.Sword, weaponSkillsNum.Mace, weaponSkillsNum.Stave, weaponSkillsNum.Shield, weaponSkillsNum.Spear, weaponSkillsNum.Chain];

  public axe: IWeapon[] = [];
  public sword: IWeapon[] = [];
  public mace: IWeapon[] = [];
  public stave: IWeapon[] = [];
  public shield: IWeapon[] = [];
  public spear: IWeapon[] = [];
  public chain: IWeapon[] = [];

  public total: ITotal = {
    stamina: 0,
    strength: 0,
    endurance: 0,
    initiative: 0,
    dodge: 0,
    weaponSkill: 0,
    shield: 0,
    learningCapacity: 0,
    luck: 0,
    discipline: 0,
  };

  public totalWithRaceBonus: ITotal = {
    stamina: 0,
    strength: 0,
    endurance: 0,
    initiative: 0,
    dodge: 0,
    weaponSkill: 0,
    shield: 0,
    learningCapacity: 0,
    luck: 0,
    discipline: 0,
  };

  public equipmentBonusesAdditive: IEquipmentBonus = {
    mainhand: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    offhand: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    head: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    shoulders: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    chest: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    gloves: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    legs: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    boots: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    cloak: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    necklace: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    ring: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    amulet: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    wrist: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
    trinket: {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    },
  };

  public equipmentBonusesMultiplier: IEquipmentBonus = {
    mainhand: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    offhand: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    head: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    shoulders: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    chest: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    gloves: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    legs: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    boots: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    cloak: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    necklace: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    ring: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    amulet: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    wrist: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
    trinket: {
      stamina: 1,
      strength: 1,
      endurance: 1,
      initiative: 1,
      dodge: 1,
      learningCapacity: 1,
      luck: 1,
      discipline: 1,
      weaponSkill: 1,
      shield: 1,
    },
  };

  public additiveBonus: IBonus = {
    stamina: 0,
    strength: 0,
    endurance: 0,
    initiative: 0,
    dodge: 0,
    learningCapacity: 0,
    luck: 0,
    discipline: 0,
    weaponSkill: 0,
    shield: 0,
  } as IBonus;

  public multiplierBonus: IBonus = {
    stamina: 1,
    strength: 1,
    endurance: 1,
    initiative: 1,
    dodge: 1,
    learningCapacity: 1,
    luck: 1,
    discipline: 1,
    weaponSkill: 1,
    shield: 1,
  } as IBonus;
  constructor() {}

  public selectRaceFromRaceName(raceName: string): IRace {
    switch (raceName) {
      case 'Människa': {
        return this.human;
      }
      case 'Alv': {
        return this.elf;
      }
      case 'Dvärg': {
        return this.dwarf;
      }
      case 'Ork': {
        return this.orc;
      }
      case 'Goblin': {
        return this.goblin;
      }
      case 'Troll': {
        return this.troll;
      }
      case 'Odöd': {
        return this.undead;
      }
      case 'Salamanth': {
        return this.salamanth;
      }
      default: {
        return this.defaultRace;
      }
    }
  }

  public selectRaceBonusFromWeaponSkill(weaponSkill: string, race: IRace): number {
    switch (weaponSkill) {
      case 'Yxa': {
        return Math.round((race.weaponSkills.axe - 1) * 100);
      }
      case 'Svärd': {
        return Math.round((race.weaponSkills.sword - 1) * 100);
      }
      case 'Hammare': {
        return Math.round((race.weaponSkills.mace - 1) * 100);
      }
      case 'Stav': {
        return Math.round((race.weaponSkills.stave - 1) * 100);
      }
      case 'Sköld': {
        return Math.round((race.weaponSkills.shield - 1) * 100);
      }
      case 'Stick': {
        return Math.round((race.weaponSkills.spear - 1) * 100);
      }
      case 'Kätting': {
        return Math.round((race.weaponSkills.chain - 1) * 100);
      }
      default: {
        return 0;
      }
    }
  }
}

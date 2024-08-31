import { ITotal } from '../interfaces/total';
import { IBonus } from '../interfaces/_armory/bonus';
import { IRace } from '../interfaces/race';

export const total: ITotal = {
  stamina: 0,
  strength: 0,
  endurance: 0,
  initiative: 0,
  dodge: 0,
  weaponSkill: 0,
  shield: 0,
};

export const additiveBonus: IBonus = {
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
};

export const multiplierBonus: IBonus = {
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
};

//#region Races
export const defaultRace: IRace = {
  name: 'Default',
  baseWeight: 0,
  damageWithShield: 1,
  critChances: { baseCrit: 1, baseMaxCrit: 1, maxDamage: 1 },
  stats: { stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, learningCapacity: 1, luck: 1, discipline: 1 },
  weaponSkills: { axe: 1, sword: 1, mace: 1, stave: 1, shield: 1, spear: 1, chain: 1 },
};
export const human: IRace = {
  name: 'Människa',
  baseWeight: 5,
  damageWithShield: 0.85,
  critChances: { baseCrit: 1.05, baseMaxCrit: 1.11, maxDamage: 1.2 },
  stats: { stamina: 1.1, strength: 1.1, endurance: 1.1, initiative: 1.1, dodge: 1.1, learningCapacity: 1.1, luck: 1.1, discipline: 1.1 },
  weaponSkills: { axe: 1.2, sword: 1.2, mace: 1.1, stave: 1.1, shield: 1.1, spear: 1.1, chain: 1.1 },
};
export const elf: IRace = {
  name: 'Alv',
  baseWeight: 0,
  damageWithShield: 0.8,
  critChances: { baseCrit: 1, baseMaxCrit: 1.1, maxDamage: 1.2 },
  stats: { stamina: 0.9, strength: 0.9, endurance: 1.3, initiative: 1.25, dodge: 1.55, learningCapacity: 1.2, luck: 1.1, discipline: 1 },
  weaponSkills: { axe: 1, sword: 1.15, mace: 1, stave: 1.2, shield: 1.25, spear: 1.3, chain: 1 },
};
export const dwarf: IRace = {
  name: 'Dvärg',
  baseWeight: 4,
  damageWithShield: 0.95,
  critChances: { baseCrit: 1.05, baseMaxCrit: 1.11, maxDamage: 1.2 },
  stats: { stamina: 1.3, strength: 1.2, endurance: 0.9, initiative: 0.85, dodge: 0.6, learningCapacity: 1.1, luck: 1, discipline: 1.2 },
  weaponSkills: { axe: 1.2, sword: 1, mace: 1.2, stave: 0.85, shield: 1.1, spear: 0.9, chain: 1 },
};
export const orc: IRace = {
  name: 'Ork',
  baseWeight: 7,
  damageWithShield: 1,
  critChances: { baseCrit: 1, baseMaxCrit: 1.09, maxDamage: 1.27 },
  stats: { stamina: 1.2, strength: 1.3, endurance: 1, initiative: 0.95, dodge: 0.7, learningCapacity: 0.9, luck: 1.05, discipline: 1.15 },
  weaponSkills: { axe: 1.1, sword: 1, mace: 1.1, stave: 0.85, shield: 0.95, spear: 1, chain: 1.1 },
};
export const goblin: IRace = {
  name: 'Goblin',
  baseWeight: 2,
  damageWithShield: 0.85,
  critChances: { baseCrit: 1, baseMaxCrit: 1.08, maxDamage: 1.2 },
  stats: { stamina: 0.85, strength: 1.2, endurance: 1, initiative: 1.1, dodge: 1.3, learningCapacity: 1, luck: 1.2, discipline: 1 },
  weaponSkills: { axe: 1, sword: 0.9, mace: 1.2, stave: 1.15, shield: 1, spear: 1.2, chain: 1.1 },
};
export const troll: IRace = {
  name: 'Troll',
  baseWeight: 12,
  damageWithShield: 0.9,
  critChances: { baseCrit: 1, baseMaxCrit: 1.07, maxDamage: 1.24 },
  stats: { stamina: 1.5, strength: 1.5, endurance: 0.8, initiative: 0.6, dodge: 0.4, learningCapacity: 0.8, luck: 1.15, discipline: 1.05 },
  weaponSkills: { axe: 0.8, sword: 0.7, mace: 0.85, stave: 0.65, shield: 0.8, spear: 0.75, chain: 0.85 },
};
export const undead: IRace = {
  name: 'Odöd',
  baseWeight: 2,
  damageWithShield: 0.85,
  critChances: { baseCrit: 1.02, baseMaxCrit: 1.09, maxDamage: 1.2 },
  stats: { stamina: 1.1, strength: 1, endurance: 2, initiative: 0.9, dodge: 1.05, learningCapacity: 0.6, luck: 0.8, discipline: 1.3 },
  weaponSkills: { axe: 1.05, sword: 1.05, mace: 1.05, stave: 1.05, shield: 1.05, spear: 1.05, chain: 1.05 },
};
export const salamanth: IRace = {
  name: 'Salamanth',
  baseWeight: 2,
  damageWithShield: 0.85,
  critChances: { baseCrit: 1.02, baseMaxCrit: 1.09, maxDamage: 1.2 },
  stats: { stamina: 1.1, strength: 1, endurance: 2, initiative: 0.9, dodge: 1.05, learningCapacity: 0.6, luck: 0.8, discipline: 1.3 },
  weaponSkills: { axe: 1.05, sword: 1.05, mace: 1.05, stave: 1.05, shield: 1.05, spear: 1.05, chain: 1.05 },
};
//#endregion
import { ITotal } from '../interfaces/total';
import { IBonus, IEquipmentBonus } from '../interfaces/_armory/bonus';
import { IRace } from '../interfaces/race';
import { IGear } from '../interfaces/_armory/gear';
import { IWeapon } from '../interfaces/_armory/weapon';
import { IArmor } from '../interfaces/_armory/armor';
import { IAccessory } from '../interfaces/_armory/accessory';
import { IConsumable } from '../interfaces/_armory/consumables';
import { IEnchant } from '../interfaces/_armory/enchants';

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

//#region Gear
export const weaponTemplate: IWeapon = {
  id: 0,
  name: '',
  bonuses: [],
  max_level: 0,
  required_level: 0,
  requires_legend: false,
  requirements: [],
  weight: 0,
  is_ranged: false,
  is_two_handed: false,
  is_shield: false,
  is_weapon: true,
  enchant_tags: [],
};

export const armorTemplate: IArmor = {
  id: 0,
  name: '',
  bonuses: [],
  max_level: 0,
  required_level: 0,
  requires_legend: false,
  requirements: [],
  weight: 0,
};

export const accessoryTemplate: IAccessory = {
  id: 0,
  name: '',
  bonuses: [],
  max_level: 0,
  required_level: 0,
  requires_legend: false,
  requirements: [],
  weight: 0,
};

export const consumableTemplate: IConsumable = {
  id: 0,
  name: '',
  bonuses: [],
  max_level: 0,
  required_level: 0,
  requires_legend: false,
  requirements: [],
  weight: 0,
  is_hidden: false,
  for_live_battle: false,
  crit_rate: 0,
  min_crit_rate: 0,
  max_crit_rate: 0,
  instant_points: [],
};

export const enchantTemplate: IEnchant = {
  absorption: 0,
  name: '',
  enchant_modifiers: [],
  enchant_tags: [],
  crit_rate: 0,
  max_crit_rate: 0,
  crit_damage_multiplier: 0,
  required_level: 0,
  block_rate: 0,
  max_damage: 0,
  restrict_to_distance: false,
  restrict_to_one_hand: false,
  restrict_to_two_hand: false,
  restrict_to_shields: false,
  weight: 0,
};

export const gearTemplate: IGear = {
  mainhand: weaponTemplate,
  offhand: weaponTemplate,
  head: armorTemplate,
  shoulders: armorTemplate,
  chest: armorTemplate,
  gloves: armorTemplate,
  legs: armorTemplate,
  boots: armorTemplate,
  cloak: armorTemplate,
  necklace: accessoryTemplate,
  ring: accessoryTemplate,
  amulet: accessoryTemplate,
  bracelet: accessoryTemplate,
  trinket: accessoryTemplate,
  consumableOne: consumableTemplate,
  consumableTwo: consumableTemplate,
  consumableThree: consumableTemplate,
  enchantOne: enchantTemplate,
  enchantTwo: enchantTemplate,
  distanceWeapon: enchantTemplate,
};
//#endregion

//#region Races
export const defaultRace: IRace = {
  name: 'Default',
  id: 0,
  baseWeight: 0,
  damageWithShield: 1,
  critChances: { baseCrit: 1, baseMaxCrit: 1, maxDamage: 1 },
  stats: { stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, learningCapacity: 1, luck: 1, discipline: 1 },
  weaponSkills: { axe: 1, sword: 1, mace: 1, stave: 1, shield: 1, spear: 1, chain: 1 },
  ageModifications: [
    { name: 'young', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'adult', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'middle', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'old', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'ancient', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
  ],
};
export const human: IRace = {
  name: 'Människa',
  id: 1,
  baseWeight: 5,
  damageWithShield: 0.85,
  critChances: { baseCrit: 1.05, baseMaxCrit: 1.11, maxDamage: 1.2 },
  stats: { stamina: 1.1, strength: 1.1, endurance: 1.1, initiative: 1.1, dodge: 1.1, learningCapacity: 1.1, luck: 1.1, discipline: 1.1 },
  weaponSkills: { axe: 1.2, sword: 1.2, mace: 1.1, stave: 1.1, shield: 1.1, spear: 1.1, chain: 1.1 },
  ageModifications: [
    { name: 'young', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'adult', age: 16, stamina: 1.07, strength: 1.07, endurance: 1.07, initiative: 1.06, dodge: 1.06, weaponSkill: 1, shield: 1 },
    { name: 'middle', age: 29, stamina: 0.95, strength: 0.95, endurance: 0.95, initiative: 0.95, dodge: 0.95, weaponSkill: 1, shield: 1 },
    { name: 'old', age: 39, stamina: 0.92, strength: 0.92, endurance: 0.92, initiative: 0.91, dodge: 0.91, weaponSkill: 0.95, shield: 0.95 },
    { name: 'ancient', age: 50, stamina: 0.88, strength: 0.88, endurance: 0.88, initiative: 0.88, dodge: 0.88, weaponSkill: 0.9, shield: 0.9 },
  ],
};
export const elf: IRace = {
  name: 'Alv',
  id: 2,
  baseWeight: 0,
  damageWithShield: 0.8,
  critChances: { baseCrit: 1, baseMaxCrit: 1.1, maxDamage: 1.2 },
  stats: { stamina: 0.9, strength: 0.9, endurance: 1.3, initiative: 1.25, dodge: 1.55, learningCapacity: 1.2, luck: 1.1, discipline: 1 },
  weaponSkills: { axe: 1, sword: 1.15, mace: 1, stave: 1.2, shield: 1.25, spear: 1.3, chain: 1 },
  ageModifications: [
    { name: 'young', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'adult', age: 18, stamina: 1.07, strength: 1.08, endurance: 1.08, initiative: 1.05, dodge: 1.05, weaponSkill: 1, shield: 1 },
    { name: 'middle', age: 35, stamina: 0.95, strength: 0.95, endurance: 0.95, initiative: 0.95, dodge: 0.95, weaponSkill: 1, shield: 1 },
    { name: 'old', age: 50, stamina: 0.94, strength: 0.94, endurance: 0.94, initiative: 0.92, dodge: 0.92, weaponSkill: 0.95, shield: 0.95 },
  ],
};
export const dwarf: IRace = {
  name: 'Dvärg',
  id: 3,
  baseWeight: 4,
  damageWithShield: 0.95,
  critChances: { baseCrit: 1.05, baseMaxCrit: 1.11, maxDamage: 1.2 },
  stats: { stamina: 1.3, strength: 1.2, endurance: 0.9, initiative: 0.85, dodge: 0.6, learningCapacity: 1.1, luck: 1, discipline: 1.2 },
  weaponSkills: { axe: 1.2, sword: 1, mace: 1.2, stave: 0.85, shield: 1.1, spear: 0.9, chain: 1 },
  ageModifications: [
    { name: 'young', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'adult', age: 16, stamina: 1.08, strength: 1.06, endurance: 1.09, initiative: 1.06, dodge: 1.09, weaponSkill: 1, shield: 1 },
    { name: 'middle', age: 29, stamina: 0.95, strength: 0.95, endurance: 0.95, initiative: 0.95, dodge: 0.95, weaponSkill: 1, shield: 1 },
    { name: 'old', age: 39, stamina: 0.92, strength: 0.92, endurance: 0.92, initiative: 0.91, dodge: 0.91, weaponSkill: 0.95, shield: 0.95 },
    { name: 'ancient', age: 50, stamina: 0.88, strength: 0.88, endurance: 0.88, initiative: 0.88, dodge: 0.88, weaponSkill: 0.9, shield: 0.9 },
  ],
};
export const orc: IRace = {
  name: 'Ork',
  id: 4,
  baseWeight: 7,
  damageWithShield: 1,
  critChances: { baseCrit: 1, baseMaxCrit: 1.09, maxDamage: 1.27 },
  stats: { stamina: 1.2, strength: 1.3, endurance: 1, initiative: 0.95, dodge: 0.7, learningCapacity: 0.9, luck: 1.05, discipline: 1.15 },
  weaponSkills: { axe: 1.1, sword: 1, mace: 1.1, stave: 0.85, shield: 0.95, spear: 1, chain: 1.1 },
  ageModifications: [
    { name: 'young', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'adult', age: 15, stamina: 1.06, strength: 1.08, endurance: 1.06, initiative: 1.09, dodge: 1.06, weaponSkill: 1, shield: 1 },
    { name: 'middle', age: 28, stamina: 0.95, strength: 0.95, endurance: 0.95, initiative: 0.95, dodge: 0.95, weaponSkill: 1, shield: 1 },
    { name: 'old', age: 39, stamina: 0.92, strength: 0.92, endurance: 0.92, initiative: 0.91, dodge: 0.91, weaponSkill: 0.95, shield: 0.95 },
    { name: 'ancient', age: 47, stamina: 0.88, strength: 0.88, endurance: 0.88, initiative: 0.88, dodge: 0.88, weaponSkill: 0.9, shield: 0.9 },
  ],
};
export const troll: IRace = {
  name: 'Troll',
  id: 5,
  baseWeight: 12,
  damageWithShield: 0.9,
  critChances: { baseCrit: 1, baseMaxCrit: 1.07, maxDamage: 1.24 },
  stats: { stamina: 1.5, strength: 1.5, endurance: 0.8, initiative: 0.6, dodge: 0.4, learningCapacity: 0.8, luck: 1.15, discipline: 1.05 },
  weaponSkills: { axe: 0.8, sword: 0.7, mace: 0.85, stave: 0.65, shield: 0.8, spear: 0.75, chain: 0.85 },
  ageModifications: [
    { name: 'young', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'adult', age: 15, stamina: 1.06, strength: 1.07, endurance: 1.08, initiative: 1.09, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'middle', age: 28, stamina: 0.95, strength: 0.95, endurance: 0.95, initiative: 0.95, dodge: 0.95, weaponSkill: 1, shield: 1 },
    { name: 'old', age: 39, stamina: 0.92, strength: 0.92, endurance: 0.92, initiative: 0.91, dodge: 0.91, weaponSkill: 0.95, shield: 0.95 },
    { name: 'ancient', age: 47, stamina: 0.88, strength: 0.88, endurance: 0.88, initiative: 0.88, dodge: 0.88, weaponSkill: 0.9, shield: 0.9 },
  ],
};
export const goblin: IRace = {
  name: 'Goblin',
  id: 6,
  baseWeight: 2,
  damageWithShield: 0.85,
  critChances: { baseCrit: 1, baseMaxCrit: 1.08, maxDamage: 1.2 },
  stats: { stamina: 0.85, strength: 1.2, endurance: 1, initiative: 1.1, dodge: 1.3, learningCapacity: 1, luck: 1.2, discipline: 1 },
  weaponSkills: { axe: 1, sword: 0.9, mace: 1.2, stave: 1.15, shield: 1, spear: 1.2, chain: 1.1 },
  ageModifications: [
    { name: 'young', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'adult', age: 14, stamina: 1.14, strength: 1.09, endurance: 1.07, initiative: 1.05, dodge: 1.05, weaponSkill: 1, shield: 1 },
    { name: 'middle', age: 26, stamina: 0.95, strength: 0.95, endurance: 0.95, initiative: 0.95, dodge: 0.95, weaponSkill: 1, shield: 1 },
    { name: 'old', age: 39, stamina: 0.92, strength: 0.92, endurance: 0.92, initiative: 0.91, dodge: 0.91, weaponSkill: 0.95, shield: 0.95 },
    { name: 'ancient', age: 47, stamina: 0.88, strength: 0.88, endurance: 0.88, initiative: 0.88, dodge: 0.88, weaponSkill: 0.9, shield: 0.9 },
  ],
};
export const undead: IRace = {
  name: 'Odöd',
  id: 7,
  baseWeight: 2,
  damageWithShield: 0.85,
  critChances: { baseCrit: 1.02, baseMaxCrit: 1.09, maxDamage: 1.2 },
  stats: { stamina: 1.1, strength: 1, endurance: 2, initiative: 0.9, dodge: 1.05, learningCapacity: 0.6, luck: 0.8, discipline: 1.3 },
  weaponSkills: { axe: 1.05, sword: 1.05, mace: 1.05, stave: 1.05, shield: 1.05, spear: 1.05, chain: 1.05 },
  ageModifications: [],
};
export const salamanth: IRace = {
  name: 'Salamanth',
  id: 11,
  baseWeight: 2,
  damageWithShield: 0.85,
  critChances: { baseCrit: 1.02, baseMaxCrit: 1.09, maxDamage: 1.2 },
  stats: { stamina: 1.1, strength: 1, endurance: 2, initiative: 0.9, dodge: 1.05, learningCapacity: 0.6, luck: 0.8, discipline: 1.3 },
  weaponSkills: { axe: 1.05, sword: 1.05, mace: 1.05, stave: 1.05, shield: 1.05, spear: 1.05, chain: 1.05 },
  ageModifications: [
    { name: 'young', age: 0, stamina: 1, strength: 1, endurance: 1, initiative: 1, dodge: 1, weaponSkill: 1, shield: 1 },
    { name: 'adult', age: 14, stamina: 1.07, strength: 1.12, endurance: 1.07, initiative: 1.03, dodge: 1.02, weaponSkill: 1, shield: 1 },
    { name: 'middle', age: 26, stamina: 0.95, strength: 0.95, endurance: 0.95, initiative: 0.95, dodge: 0.95, weaponSkill: 1, shield: 1 },
    { name: 'old', age: 39, stamina: 0.92, strength: 0.92, endurance: 0.92, initiative: 0.91, dodge: 0.91, weaponSkill: 0.95, shield: 0.95 },
    { name: 'ancient', age: 47, stamina: 0.88, strength: 0.88, endurance: 0.88, initiative: 0.88, dodge: 0.88, weaponSkill: 0.9, shield: 0.9 },
  ],
};
//#endregion

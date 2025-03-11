import { IBonus } from './_armory/bonus';
import { ICritChances } from './crit-chances';
import { IStats } from './stats';
import { IWeaponSkills } from './weapon-skills';

export interface IRace {
  id: number;
  name: string;
  baseWeight: number;
  damageWithShield: number;
  critChances: ICritChances;
  stats: IStats;
  weaponSkills: IWeaponSkills;
  ageModifications: IAgeModifier[];
}

export interface IApiRace {
  id: number;
  stats: IApiBonuses[];
  weapon_skills: IApiBonuses[];
}

export interface IApiBonuses {
  type: number;
  value: number;
}

export interface IAgeModifier {
  name: 'young' | 'adult' | 'middle' | 'old' | 'ancient';
  age: number;
  stamina: number;
  strength: number;
  endurance: number;
  initiative: number;
  dodge: number;
  weaponSkill: number;
  shield: number;
}

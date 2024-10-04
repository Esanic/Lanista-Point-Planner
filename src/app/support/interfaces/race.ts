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

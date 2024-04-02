import { ILevel } from './level';

export interface IBuild {
  name?: string;
  race: string;
  weaponSkill: string;
  levels: ILevel[];
}

import { IGearNames } from './_armory/gear';
import { ILevel } from './level';

export interface IBuild {
  name?: string;
  race: string;
  age: string;
  weaponSkill: string;
  levels: ILevel[];
  equipment: IGearNames;
  showLegendEquipment: boolean;
  twoHandedBuild: boolean;
}

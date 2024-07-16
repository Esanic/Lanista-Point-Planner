import { IEquipment } from './equipment';

export interface IConsumable extends IEquipment {
  instant_points: IInstantPoints[];
  is_hidden: boolean;
  for_live_battle: boolean;
  crit_rate: number;
  min_crit_rate: number;
  max_crit_rate: number;
  max_level: number;
}

export interface IInstantPoints {
  value: string;
  type: string;
  duration: string;
}

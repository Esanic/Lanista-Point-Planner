import { IEquipmentBonus } from './bonus';

export interface IConsumable {
  id: number;
  name: string;
  weight?: number;
  bonuses: IEquipmentBonus[];
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

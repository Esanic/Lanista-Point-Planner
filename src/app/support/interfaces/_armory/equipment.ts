import { IEquipmentBonus } from './bonus';

export interface IEquipment {
  id: number;
  name: string;
  type?: number;
  bonuses: IEquipmentBonus[];
  max_level: number;
  required_level: number;
  requires_legend?: boolean;
  weight: number;
}

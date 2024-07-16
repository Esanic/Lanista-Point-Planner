import { IEquipment } from './equipment';

// export interface IArmor {
//   id: number;
//   name: string;
//   type: number;
//   bonuses: IEquipmentBonus[];
//   is_ranged: boolean;
//   is_shield: boolean;
//   is_two_handed: boolean;
//   is_weapon: boolean;
//   max_level: number;
//   required_level: number;
//   requires_legend: boolean;
//   weight: number;
// }

export interface IArmor extends IEquipment {}

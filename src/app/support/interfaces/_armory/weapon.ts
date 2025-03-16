import { IEnchantTag } from './enchants';
import { IEquipment } from './equipment';

export interface IWeapon extends IEquipment {
  is_ranged: boolean;
  is_shield: boolean;
  is_two_handed: boolean;
  is_weapon: boolean;
  enchant_tags: IEnchantTag[];
}

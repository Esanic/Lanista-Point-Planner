export interface IEnchant {
  absorption: number;
  name: string;
  enchant_modifiers: IEnchantModifier[];
  enchant_tags: IEnchantTag[];
  crit_rate: number;
  max_crit_rate: number;
  crit_damage_multiplier: number;
  required_level: number;
  block_rate: number;
  max_damage: number;
  restrict_to_distance: boolean;
  restrict_to_one_hand: boolean;
  restrict_to_two_hand: boolean;
  restrict_to_shields: boolean;
  weight: number;
}

export interface IEnchantTag {
  name: string;
  default_weapon_types: string[];
}

interface IEnchantModifier {
  enchant_value: number | string;
  enchantable_name: string;
  proc_type_name: string;
}

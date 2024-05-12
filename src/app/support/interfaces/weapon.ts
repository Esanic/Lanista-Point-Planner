export interface Weapon {
  id: number;
  name: string;
  type: number;
  bonuses: WeaponBonus[];
  is_ranged: boolean;
  is_shield: boolean;
  is_two_handed: boolean;
  is_weapon: boolean;
  required_level: number;
  requires_legend: boolean;
}

export interface WeaponBonus {
  type: string;
  additive: number;
}

export interface IWeapon {
  id: number;
  name: string;
  type: number;
  bonuses: IWeaponBonus[];
  is_ranged: boolean;
  is_shield: boolean;
  is_two_handed: boolean;
  is_weapon: boolean;
  max_level: number;
  required_level: number;
  requires_legend: boolean;
}

export interface IWeaponBonus {
  type: string;
  additive: number;
}

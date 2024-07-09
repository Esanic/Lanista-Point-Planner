export interface IBonus {
  stamina: number;
  strength: number;
  endurance: number;
  initiative: number;
  dodge: number;
  weaponSkill: number;
  shield: number;
  [key: string]: number;
}

export interface ITotalBonus {
  additiveBonus: IBonus;
  multiplierBonus: IBonus;
}

export interface IEquipmentBonus {
  type: string;
  additive?: number;
  multiplier?: number;
}

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

//TODO: Change the name of this interface to something more descriptive
export interface ITotalBonus {
  additiveBonus: IBonus;
  multiplierBonus: IBonus;
}

export interface IEquipmentBonus {
  type: string;
  additive?: number;
  multiplier?: number;
}

export interface IBonus {
  stamina: number;
  strength: number;
  endurance: number;
  initiative: number;
  dodge: number;
  learningCapacity: number;
  luck: number;
  discipline: number;
  weaponSkill: number;
  shield: number;
  [key: string]: number;
}

export interface ITotalBonus {
  additiveBonus: IBonus;
  multiplierBonus: IBonus;
}

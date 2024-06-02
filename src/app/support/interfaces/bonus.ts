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

export interface IEquipmentBonus {
  mainhand: IBonus;
  offhand: IBonus;
  head: IBonus;
  shoulders: IBonus;
  chest: IBonus;
  gloves: IBonus;
  legs: IBonus;
  boots: IBonus;
  cloak: IBonus;
  necklace: IBonus;
  ring: IBonus;
  amulet: IBonus;
  wrist: IBonus;
  trinket: IBonus;
  [key: string]: IBonus;
}

export interface ITotalBonus {
  additiveBonus: IBonus;
  multiplierBonus: IBonus;
}

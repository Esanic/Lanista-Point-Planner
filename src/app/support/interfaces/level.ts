export interface ILevel {
  level: number | string;
  stamina: number;
  strength: number;
  endurance: number;
  initiative: number;
  dodge: number;
  weaponSkill?: number;
  shield?: number;
  placedPoints: number;
  maxPlacedPoints?: number;
}

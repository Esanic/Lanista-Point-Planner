import { IBonus } from './bonus';

export interface IEquipmentBonusSlots {
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
  consumableOne: IBonus;
  consumableTwo: IBonus;
  consumableThree: IBonus;
  [key: string]: IBonus;
}

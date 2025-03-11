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
  bracelet: IBonus;
  trinket: IBonus;
  consumableOne: IBonus;
  consumableTwo: IBonus;
  consumableThree: IBonus;
  enchantOne: IBonus;
  enchantTwo: IBonus;
  distanceWeapon: IBonus;
  age: IBonus;
  [key: string]: IBonus;
}

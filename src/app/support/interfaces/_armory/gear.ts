import { IAccessory } from './accessory';
import { IArmor } from './armor';
import { IConsumable } from './consumables';
import { IEnchant } from './enchants';
import { IWeapon } from './weapon';

export interface IGear {
  mainhand: IWeapon;
  offhand: IWeapon;
  head: IArmor;
  shoulders: IArmor;
  chest: IArmor;
  gloves: IArmor;
  legs: IArmor;
  boots: IArmor;
  cloak: IAccessory;
  necklace: IAccessory;
  ring: IAccessory;
  amulet: IAccessory;
  bracelet: IAccessory;
  trinket: IAccessory;
  consumableOne: IConsumable;
  consumableTwo: IConsumable;
  consumableThree: IConsumable;
  enchantOne: IEnchant;
  enchantTwo: IEnchant;
  distanceWeapon: IEnchant;
  [key: string]: IWeapon | IArmor | IAccessory | IConsumable | IEnchant;
}

export interface IGearNames {
  mainhand: string;
  offhand: string;
  head: string;
  shoulders: string;
  chest: string;
  gloves: string;
  legs: string;
  boots: string;
  cloak: string;
  necklace: string;
  ring: string;
  amulet: string;
  bracelet: string;
  trinket: string;
  consumableOne: string;
  consumableTwo: string;
  consumableThree: string;
  enchantOne: string;
  enchantTwo: string;
  distanceWeapon: string;
}

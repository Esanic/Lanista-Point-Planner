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
  [key: string]: IWeapon | IArmor | IAccessory | IConsumable | IEnchant;
}

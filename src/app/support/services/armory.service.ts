import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBonus, ITotalBonus } from '../interfaces/_armory/bonus';

import { IEquipmentBonusSlots } from '../interfaces/_armory/equipmentBonus';
import { additiveBonus, gearTemplate as gearTemplate, multiplierBonus, weaponTemplate } from '../constants/templates';
import { IWeapon } from '../interfaces/_armory/weapon';
import { IArmor } from '../interfaces/_armory/armor';
import { IAccessory } from '../interfaces/_armory/accessory';
import { IConsumable } from '../interfaces/_armory/consumables';
import { IEnchant } from '../interfaces/_armory/enchants';
import { IGear, IGearNames } from '../interfaces/_armory/gear';

@Injectable({
  providedIn: 'root',
})
export class ArmoryService {
  private legendEquipment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private shieldBuild: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private twoHandedBuild: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private armorsAndAccessoriesFetched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private weaponsFetched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private consumablesFetched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private gear: BehaviorSubject<IGear> = new BehaviorSubject<IGear>({ ...gearTemplate });
  private importedGear: BehaviorSubject<IGearNames> = new BehaviorSubject<IGearNames>({} as IGearNames);

  private emitBonusAdded: Subject<boolean> = new Subject<boolean>();

  //#region Equipment arrays
  //TODO: Rework these to observables
  public axe: IWeapon[] = [];
  public sword: IWeapon[] = [];
  public mace: IWeapon[] = [];
  public stave: IWeapon[] = [];
  public shield: IWeapon[] = [];
  public spear: IWeapon[] = [];
  public chain: IWeapon[] = [];
  public distanceWeapon: IEnchant[] = [];

  public head: IArmor[] = [];
  public shoulders: IArmor[] = [];
  public chest: IArmor[] = [];
  public gloves: IArmor[] = [];
  public legs: IArmor[] = [];
  public boots: IArmor[] = [];

  public back: IAccessory[] = []; // 8
  public neck: IAccessory[] = []; // 6
  public finger: IAccessory[] = []; //7
  public amulet: IAccessory[] = []; //9
  public bracelet: IAccessory[] = []; //10
  public trinket: IAccessory[] = []; //11

  public consumables: IConsumable[] = [];

  public enchants: IEnchant[] = [];
  //#endregion

  //#region Equipment bonuses
  public equipmentBonusesAdditive: IEquipmentBonusSlots = {
    mainhand: { ...additiveBonus },
    offhand: { ...additiveBonus },
    head: { ...additiveBonus },
    shoulders: { ...additiveBonus },
    chest: { ...additiveBonus },
    gloves: { ...additiveBonus },
    legs: { ...additiveBonus },
    boots: { ...additiveBonus },
    cloak: { ...additiveBonus },
    necklace: { ...additiveBonus },
    ring: { ...additiveBonus },
    amulet: { ...additiveBonus },
    bracelet: { ...additiveBonus },
    trinket: { ...additiveBonus },
    consumableOne: { ...additiveBonus },
    consumableTwo: { ...additiveBonus },
    consumableThree: { ...additiveBonus },
    enchantOne: { ...additiveBonus },
    enchantTwo: { ...additiveBonus },
    distanceWeapon: { ...additiveBonus },
    age: { ...additiveBonus },
  };

  public equipmentBonusesMultiplier: IEquipmentBonusSlots = {
    mainhand: { ...multiplierBonus },
    offhand: { ...multiplierBonus },
    head: { ...multiplierBonus },
    shoulders: { ...multiplierBonus },
    chest: { ...multiplierBonus },
    gloves: { ...multiplierBonus },
    legs: { ...multiplierBonus },
    boots: { ...multiplierBonus },
    cloak: { ...multiplierBonus },
    necklace: { ...multiplierBonus },
    ring: { ...multiplierBonus },
    amulet: { ...multiplierBonus },
    bracelet: { ...multiplierBonus },
    trinket: { ...multiplierBonus },
    consumableOne: { ...multiplierBonus },
    consumableTwo: { ...multiplierBonus },
    consumableThree: { ...multiplierBonus },
    enchantOne: { ...multiplierBonus },
    enchantTwo: { ...multiplierBonus },
    distanceWeapon: { ...multiplierBonus },
    age: { ...multiplierBonus },
  };
  //#endregion

  constructor() {}

  //* Legend equipment
  public setLegendEquipmentViewStatus(value: boolean): void {
    this.legendEquipment.next(value);
  }

  public getLegendEquipmentViewStatus(): Observable<boolean> {
    return this.legendEquipment.asObservable();
  }

  //* Shield build
  public setShieldBuild(value: boolean): void {
    this.shieldBuild.next(value);
    if (value && this.twoHandedBuild.value) {
      this.setTwoHandedBuild(false);
      this.setGear('mainhand', weaponTemplate);
    }
  }

  public getShieldBuild(): Observable<boolean> {
    return this.shieldBuild.asObservable();
  }

  //* Two handed build
  public setTwoHandedBuild(value: boolean): void {
    this.twoHandedBuild.next(value);
  }

  public getTwoHandedBuild(): Observable<boolean> {
    return this.twoHandedBuild.asObservable();
  }

  public setGear(key: string, value: IWeapon | IArmor | IAccessory | IConsumable | IEnchant): void {
    this.gear.value[key] = value;
    this.gear.next(this.gear.value);
  }

  public resetGear(): void {
    this.gear.next({ ...gearTemplate });
  }

  public getGear(): Observable<IGear> {
    return this.gear.asObservable();
  }

  //TODO: Look into how it would be possible to incoperate this into the gear object
  public setImportedGear(value: IGearNames): void {
    this.importedGear.next(value);
  }

  public getImportedGear(): Observable<IGearNames> {
    return this.importedGear.asObservable();
  }

  //* Gear arrays fetched */

  // Armors and Accessories are being fetched in the same API call
  public emitArmorsAndAccessoriesFetched(): void {
    this.armorsAndAccessoriesFetched.next(true);
  }

  public listenArmorsAndAccessoriesFetched(): Observable<boolean> {
    return this.armorsAndAccessoriesFetched.asObservable();
  }

  public emitWeaponsFetched(): void {
    this.weaponsFetched.next(true);
  }

  public listenWeaponsFetched(): Observable<boolean> {
    return this.weaponsFetched.asObservable();
  }

  public emitConsumablesFetched(): void {
    this.consumablesFetched.next(true);
  }

  public listenConsumablesFetched(): Observable<boolean> {
    return this.consumablesFetched.asObservable();
  }

  //* Bonuses */

  public emitBonusesHaveBeenAdded(): void {
    this.emitBonusAdded.next(true);
  }

  public listenBonusesHaveBeenAdded(): Observable<boolean> {
    return this.emitBonusAdded.asObservable();
  }

  /** Adds bonuses to the correct equipment slot */
  public addBonus(gearSlot: string, bonusesToAdd: ITotalBonus): void {
    this.equipmentBonusesAdditive[gearSlot] = bonusesToAdd.additiveBonus;
    this.equipmentBonusesMultiplier[gearSlot] = bonusesToAdd.multiplierBonus;
  }

  /** Returns the total additive bonuses from all equipment */
  //TODO: Move this to helper
  public getBonusesAdditive(): IBonus {
    let totalBonuses: IBonus = { ...additiveBonus };

    Object.keys(totalBonuses).forEach((stat) => {
      Object.keys(this.equipmentBonusesAdditive).forEach((gearSlot) => {
        totalBonuses[stat] += this.equipmentBonusesAdditive[gearSlot][stat];
      });
    });

    return totalBonuses;
  }

  /** Returns the total multiplicative bonuses from all equipment */
  //TODO: Move this to helper
  public getBonusesMultiplier(): IBonus {
    let totalBonuses: IBonus = { ...multiplierBonus };

    Object.keys(totalBonuses).forEach((stat) => {
      Object.keys(this.equipmentBonusesMultiplier).forEach((gearSlot) => {
        totalBonuses[stat] += this.equipmentBonusesMultiplier[gearSlot][stat] - 1;
      });
    });

    return totalBonuses;
  }
}

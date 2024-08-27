import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBonus, ITotalBonus } from '../interfaces/_armory/bonus';
import { GlobalService } from './global.service';
import { IEquipmentBonusSlots } from '../interfaces/_armory/equipmentBonus';

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

  private emitBonusAdded: Subject<boolean> = new Subject<boolean>();

  private equipmentBonusesAdditive: IEquipmentBonusSlots = this.globalService.equipmentBonusesAdditive;
  private equipmentBonusesMultiplier: IEquipmentBonusSlots = this.globalService.equipmentBonusesMultiplier;

  constructor(private globalService: GlobalService) {}

  //* Legend equipment
  public setLegendEquipmentViewStatus(value: boolean): void {
    this.legendEquipment.next(value);
  }

  public getLegendEquipmentViewStatus(): Observable<boolean> {
    return this.legendEquipment.asObservable();
  }

  //* Shield build
  public emitShieldBuild(event: boolean): void {
    this.shieldBuild.next(event);
  }

  public listenShieldBuild(): Observable<boolean> {
    return this.shieldBuild.asObservable();
  }

  //* Two handed build
  public emitTwoHandedBuild(event: boolean): void {
    this.twoHandedBuild.next(event);
  }

  public listenTwoHandedBuild(): Observable<boolean> {
    return this.twoHandedBuild.asObservable();
  }

  /** Gear arrays fetched */

  //* Armors and Accessories are being fetched in the same API call
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

  /** Bonuses */
  public emitBonusesHaveBeenAdded(): void {
    this.emitBonusAdded.next(true);
  }

  public listenBonusesHaveBeenAdded(): Observable<boolean> {
    return this.emitBonusAdded.asObservable();
  }

  //Adds bonuses to the correct equipment slot
  public addBonus(gearSlot: string, bonusesToAdd: ITotalBonus): void {
    this.equipmentBonusesAdditive[gearSlot] = bonusesToAdd.additiveBonus;
    this.equipmentBonusesMultiplier[gearSlot] = bonusesToAdd.multiplierBonus;
  }

  //Returns the total additive bonuses from all equipment
  public getBonusesAdditive(): IBonus {
    let totalBonuses: IBonus = { ...this.globalService.additiveBonusTemplate };

    Object.keys(totalBonuses).forEach((stat) => {
      Object.keys(this.equipmentBonusesAdditive).forEach((gearSlot) => {
        totalBonuses[stat] += this.equipmentBonusesAdditive[gearSlot][stat];
      });
    });

    return totalBonuses;
  }

  //Returns the total multiplicative bonuses from all equipment
  public getBonusesMultiplier(): IBonus {
    let totalBonuses: IBonus = { ...this.globalService.multiplierBonusTemplate };

    Object.keys(totalBonuses).forEach((stat) => {
      Object.keys(this.equipmentBonusesMultiplier).forEach((gearSlot) => {
        totalBonuses[stat] += this.equipmentBonusesMultiplier[gearSlot][stat] - 1;
      });
    });

    return totalBonuses;
  }
}

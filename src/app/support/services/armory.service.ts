import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBonus, ITotalBonus } from '../interfaces/_armory/bonus';
import { IWeapon } from '../interfaces/_armory/weapon';
import { weaponSkillStr } from '../enums/weapon-skills.enums';
import { GlobalService } from './global.service';
import { IEquipmentBonusSlots } from '../interfaces/_armory/equipmentBonus';
import { IArmor } from '../interfaces/_armory/armor';
import { emptyString } from '../constants/global';
import { IConsumable } from '../interfaces/_armory/consumables';
import { IEquipment } from '../interfaces/_armory/equipment';

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

  //TODO: Add more possible interfaces to equipment
  public calculateBonusesFromEquipment(equipment: IEquipment, selectedWeaponSkill?: string): ITotalBonus {
    const weaponSkillEnums = [weaponSkillStr.Axe, weaponSkillStr.Sword, weaponSkillStr.Mace, weaponSkillStr.Stave, weaponSkillStr.Spear, weaponSkillStr.Chain];
    const weaponSkillTypes = ['axe', 'sword', 'mace', 'stave', 'spear', 'chain'];
    let multiplierBonus: IBonus = { ...this.globalService.multiplierBonusTemplate };
    let additiveBonus: IBonus = { ...this.globalService.additiveBonusTemplate };

    equipment.bonuses.forEach((bonus) => {
      if (bonus.additive !== undefined) {
        if (selectedWeaponSkill) {
          const index = weaponSkillTypes.findIndex((type) => type.toLowerCase() === bonus.type.toLowerCase());
          if (index !== -1 && selectedWeaponSkill === weaponSkillEnums[index]) {
            additiveBonus.weaponSkill += bonus.additive;
          }
        }

        switch (bonus.type.toLowerCase()) {
          case 'stamina':
            additiveBonus.stamina += bonus.additive;
            break;
          case 'strength':
            additiveBonus.strength += bonus.additive;
            break;
          case 'endurance':
            additiveBonus.endurance += bonus.additive;
            break;
          case 'initiative':
            additiveBonus.initiative += bonus.additive;
            break;
          case 'dodge':
            additiveBonus.dodge += bonus.additive;
            break;
          case 'shield':
            additiveBonus.shield += bonus.additive;
            break;
          default:
            break;
        }
      }

      if (bonus.multiplier !== undefined) {
        if (selectedWeaponSkill) {
          const index = weaponSkillTypes.findIndex((type) => type.toLowerCase() === bonus.type.toLowerCase());
          if (index !== -1 && selectedWeaponSkill === weaponSkillEnums[index]) {
            multiplierBonus.weaponSkill += bonus.multiplier - 1;
          }
        }

        switch (bonus.type.toLowerCase()) {
          case 'stamina':
            multiplierBonus.stamina += bonus.multiplier - 1;
            break;
          case 'strength':
            multiplierBonus.strength += bonus.multiplier - 1;
            break;
          case 'endurance':
            multiplierBonus.endurance += bonus.multiplier - 1;
            break;
          case 'initiative':
            multiplierBonus.initiative += bonus.multiplier - 1;
            break;
          case 'dodge':
            multiplierBonus.dodge += bonus.multiplier - 1;
            break;
          case 'shield':
            multiplierBonus.shield += bonus.multiplier - 1;
            break;
          default:
            break;
        }
      }
    });

    return { additiveBonus, multiplierBonus };
  }
}

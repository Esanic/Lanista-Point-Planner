import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBonus, ITotalBonus } from '../interfaces/_armory/bonus';
import { IWeapon } from '../interfaces/_armory/weapon';
import { weaponSkillStr } from '../enums/weapon-skills.enums';
import { GlobalService } from './global.service';
import { IEquipmentBonusSlots } from '../interfaces/_armory/equipmentBonus';
import { IArmor } from '../interfaces/_armory/armor';

@Injectable({
  providedIn: 'root',
})
export class ArmoryService {
  private legendEquipment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private shieldBuild: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private armorsFetched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private weaponsFetched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private emitBonusAdded: Subject<boolean> = new Subject<boolean>();

  private equipmentBonusesAdditive: IEquipmentBonusSlots = this.globalService.equipmentBonusesAdditive;
  private equipmentBonusesMultiplier: IEquipmentBonusSlots = this.globalService.equipmentBonusesMultiplier;

  constructor(private globalService: GlobalService) {}

  public setLegendEquipmentViewStatus(value: boolean): void {
    this.legendEquipment.next(value);
  }

  public getLegendEquipmentViewStatus(): Observable<boolean> {
    return this.legendEquipment.asObservable();
  }

  public emitShieldBuild(event: boolean): void {
    this.shieldBuild.next(event);
  }

  public listenShieldBuild(): Observable<boolean> {
    return this.shieldBuild.asObservable();
  }

  public emitBonusesHaveBeenAdded(event: any): void {
    this.emitBonusAdded.next(event);
  }

  public listenBonusesHaveBeenAdded(): Observable<boolean> {
    return this.emitBonusAdded.asObservable();
  }

  public emitArmorsFetched(event: boolean): void {
    this.armorsFetched.next(event);
  }

  public listenArmorsFetched(): Observable<boolean> {
    return this.armorsFetched.asObservable();
  }

  public emitWeaponsFetched(): void {
    this.weaponsFetched.next(true);
  }

  public listenWeaponsFetched(): Observable<boolean> {
    return this.weaponsFetched.asObservable();
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
  public calculateBonusesFromEquipment(equipment: IWeapon, selectedWeaponSkill?: string): ITotalBonus {
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
          case 'learningcapacity':
            additiveBonus.learningCapacity += bonus.additive;
            break;
          case 'luck':
            additiveBonus.luck += bonus.additive;
            break;
          case 'discipline':
            additiveBonus.discipline += bonus.additive;
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
          case 'learningcapacity':
            multiplierBonus.learningCapacity += bonus.multiplier - 1;
            break;
          case 'luck':
            multiplierBonus.luck += bonus.multiplier - 1;
            break;
          case 'discipline':
            multiplierBonus.discipline += bonus.multiplier - 1;
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

  public filterAndRenameEquipment(equipmentArray: IWeapon[] | IArmor[], currentMaxLevel: number, showLegendEquipment: boolean): IWeapon[] | IArmor[] {
    const equipment = JSON.parse(JSON.stringify(equipmentArray));

    let filteredWeapons: IWeapon[] | IArmor[] = [];
    //? Should this be passed as a parameter?
    if (showLegendEquipment) {
      filteredWeapons = equipment.filter((weapon: IWeapon | IArmor) => weapon.max_level <= currentMaxLevel && weapon.required_level <= currentMaxLevel);
    } else {
      filteredWeapons = equipment.filter((weapon: IWeapon | IArmor) => !weapon.requires_legend && weapon.max_level <= currentMaxLevel && weapon.required_level <= currentMaxLevel);
    }

    const renamedEquipment: IWeapon[] | IArmor[] = filteredWeapons.map((weapon) => {
      weapon.name = `${weapon.name} (G${weapon.required_level}${weapon.max_level ? '-' + weapon.max_level : ''}) ${weapon.requires_legend ? '(L)' : ''}`;
      return weapon;
    });

    const sortedEquipment = renamedEquipment.sort((a, b) => a.required_level - b.required_level);

    return sortedEquipment;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBonus, IEquipmentBonus } from '../interfaces/bonus';
import { IWeapon } from '../interfaces/weapon';
import { weaponSkillStr } from '../enums/weapon-skills.enums';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ArmoryService {
  private legendEquipment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private emitBonusAdded: Subject<boolean> = new Subject<boolean>();

  private equipmentBonuses: IEquipmentBonus = this.globalService.equipmentBonuses;

  constructor(private globalService: GlobalService) {}

  public setLegendEquipmentViewStatus(value: boolean): void {
    this.legendEquipment.next(value);
  }

  public getLegendEquipmentViewStatus(): Observable<boolean> {
    return this.legendEquipment.asObservable();
  }

  public emitBonusesHaveBeenAdded(event: any): void {
    this.emitBonusAdded.next(event);
  }

  public listenBonusesHaveBeenAdded(): Observable<boolean> {
    return this.emitBonusAdded.asObservable();
  }

  public addBonus(gearSlot: string, bonusesToAdd: IBonus): void {
    if (gearSlot === 'mainhand') {
      this.equipmentBonuses.mainhand = bonusesToAdd;
    }
    if (gearSlot === 'offhand') {
      this.equipmentBonuses.offhand = bonusesToAdd;
    }
  }
  //Apply this when summarizing table raceBonus
  public getBonuses(): IBonus {
    let totalBonuses: IBonus = {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    } as IBonus;

    Object.keys(totalBonuses).forEach((stat) => {
      Object.keys(this.equipmentBonuses).forEach((gearSlot) => {
        totalBonuses[stat] += this.equipmentBonuses[gearSlot][stat];
      });
    });

    //Recieves double the bonuses

    return totalBonuses;
  }

  public calculateBonusesFromEquipment(equipment: IWeapon, selectedWeaponSkill?: string): IBonus {
    let bonusToAdd: IBonus = {
      stamina: 0,
      strength: 0,
      endurance: 0,
      initiative: 0,
      dodge: 0,
      learningCapacity: 0,
      luck: 0,
      discipline: 0,
      weaponSkill: 0,
      shield: 0,
    } as IBonus;

    equipment.bonuses.forEach((bonus) => {
      //* Check if the bonus is a weapon skill bonus and if the selected weapon skill is the same as the bonus type
      if (selectedWeaponSkill) {
        if (
          bonus.type.toLowerCase() === 'axe' ||
          bonus.type.toLowerCase() === 'sword' ||
          bonus.type.toLowerCase() === 'mace' ||
          bonus.type.toLowerCase() === 'stave' ||
          bonus.type.toLowerCase() === 'spear' ||
          bonus.type.toLowerCase() === 'chain'
        ) {
          if (bonus.type.toLowerCase() === 'axe' && selectedWeaponSkill === weaponSkillStr.Axe) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'sword' && selectedWeaponSkill === weaponSkillStr.Sword) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'mace' && selectedWeaponSkill === weaponSkillStr.Mace) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'stave' && selectedWeaponSkill === weaponSkillStr.Stave) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'spear' && selectedWeaponSkill === weaponSkillStr.Spear) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'chain' && selectedWeaponSkill === weaponSkillStr.Chain) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
        }
      }

      //* Add the bonus to the bonusToAdd object
      switch (bonus.type.toLowerCase()) {
        case 'stamina': {
          bonusToAdd.stamina += bonus.additive;
          break;
        }
        case 'strength': {
          bonusToAdd.strength += bonus.additive;
          break;
        }
        case 'endurance': {
          bonusToAdd.endurance += bonus.additive;
          break;
        }
        case 'initiative': {
          bonusToAdd.initiative += bonus.additive;
          break;
        }
        case 'dodge': {
          bonusToAdd.dodge += bonus.additive;
          break;
        }
        case 'learningcapacity': {
          bonusToAdd.learningCapacity += bonus.additive;
          break;
        }
        case 'luck': {
          bonusToAdd.luck += bonus.additive;
          break;
        }
        case 'discipline': {
          bonusToAdd.discipline += bonus.additive;
          break;
        }
        case 'shield': {
          bonusToAdd.shield += bonus.additive;
          break;
        }
        default: {
          break;
        }
      }
    });

    return bonusToAdd;
  }
}

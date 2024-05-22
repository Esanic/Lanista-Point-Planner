import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBonus } from '../interfaces/bonus';

@Injectable({
  providedIn: 'root',
})
export class ArmoryService {
  private legendEquipment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private emitBonusAdded: Subject<boolean> = new Subject<boolean>();

  private bonuses: IBonus = {
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

  constructor() {}

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

  public addBonus(bonusesToAdd: IBonus): void {
    this.bonuses.stamina += bonusesToAdd.stamina;
    this.bonuses.strength += bonusesToAdd.strength;
    this.bonuses.endurance += bonusesToAdd.endurance;
    this.bonuses.initiative += bonusesToAdd.initiative;
    this.bonuses.dodge += bonusesToAdd.dodge;
    this.bonuses.learningCapacity += bonusesToAdd.learningCapacity;
    this.bonuses.luck += bonusesToAdd.luck;
    this.bonuses.discipline += bonusesToAdd.discipline;
    this.bonuses.weaponSkill += bonusesToAdd.weaponSkill;
    this.bonuses.shield += bonusesToAdd.shield;
    console.log(2);
  }

  public getBonuses(): IBonus {
    return this.bonuses;
  }
}

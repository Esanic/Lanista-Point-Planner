import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBonus } from '../interfaces/bonus';

@Injectable({
  providedIn: 'root',
})
export class ArmoryService {
  private legendEquipment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private bonuses: IBonus[] = [];

  constructor() {}

  public setLegendEquipmentViewStatus(value: boolean): void {
    this.legendEquipment.next(value);
  }

  public getLegendEquipmentViewStatus(): Observable<boolean> {
    return this.legendEquipment.asObservable();
  }

  public addBonus(): void {}
}

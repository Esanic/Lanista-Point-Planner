import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBuild } from '../interfaces/build';

@Injectable({
  providedIn: 'root',
})
export class BuildService {
  private selectedBuild: Subject<IBuild> = new Subject<IBuild>();

  private buildFromTable: BehaviorSubject<IBuild> = new BehaviorSubject({} as IBuild);

  private chosenRace: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private chosenWeaponSkill: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private importedStats: Subject<any> = new Subject<any>();

  private updateBuildListEmit: Subject<any> = new Subject<any>();
  private wipeDataEmit: Subject<any> = new Subject<any>();

  constructor() {}

  //* Selector *//
  public setSelectedBuild(build: IBuild): void {
    this.selectedBuild.next(build);
  }

  public getSelectedBuild(): Observable<IBuild> {
    return this.selectedBuild.asObservable();
  }

  //* Update Build-List from localStorage *//
  public emitUpdateBuildList(event: any) {
    this.updateBuildListEmit.next(event);
  }

  public listenToUpdateBuildList(): Observable<any> {
    return this.updateBuildListEmit.asObservable();
  }

  //* Wipe data *//
  public emitWipeData(event: any): void {
    this.wipeDataEmit.next(event);
  }

  public listenWipeData(): Observable<any> {
    return this.wipeDataEmit.asObservable();
  }

  //* Imported Stats *//
  setImportedStats(stats: any) {
    this.importedStats.next(stats);
  }

  getImportedStats(): Observable<any> {
    return this.importedStats.asObservable();
  }

  //* Set and Gets from race, weaponskill and table *//
  public setChosenRace(race: string) {
    this.chosenRace.next(race);
  }

  public getChosenRace(): Observable<string> {
    return this.chosenRace.asObservable();
  }

  public setChosenWeaponSkill(skill: string) {
    this.chosenWeaponSkill.next(skill);
  }

  public getChosenWeaponSkill(): Observable<string> {
    return this.chosenWeaponSkill.asObservable();
  }

  public setStatsFromTable(build: IBuild): void {
    this.buildFromTable.next(build);
  }

  public getStatsFromTable(): Observable<IBuild> {
    return this.buildFromTable.asObservable();
  }
}

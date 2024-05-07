import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBuild } from '../interfaces/build';

@Injectable({
  providedIn: 'root',
})
export class BuildService {
  private selectedBuild: Subject<IBuild> = new Subject<IBuild>();
  private deslectBuildEmit: Subject<any> = new Subject<any>();
  private selectedBuildVariable: IBuild = {} as IBuild;

  private buildFromTable: BehaviorSubject<IBuild> = new BehaviorSubject({} as IBuild);

  private chosenRace: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private chosenWeaponSkill: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private chosenLevels: BehaviorSubject<number> = new BehaviorSubject<number>(25);
  private chosenLevelsSubject: Subject<number> = new Subject<number>();
  private importedStats: Subject<any> = new Subject<any>();

  private updateBuildListEmit: Subject<any> = new Subject<any>();
  private wipeDataEmit: Subject<any> = new Subject<any>();
  private wipeTableEmit: Subject<any> = new Subject<any>();

  constructor() {}

  //* Select build *//
  public setSelectedBuild(build: IBuild): void {
    this.selectedBuild.next(build);
    this.selectedBuildVariable = build;
  }

  public getSelectedBuild(): Observable<IBuild> {
    return this.selectedBuild.asObservable();
  }

  public getSelectedBuildVar(): IBuild {
    return this.selectedBuildVariable;
  }

  public emitDeselectBuild(event: any): void {
    this.deslectBuildEmit.next(event);
    this.selectedBuildVariable = {} as IBuild;
  }

  public listenDeselectBuild(): Observable<any> {
    return this.deslectBuildEmit.asObservable();
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

  public emitWipeTable(event: any): void {
    this.wipeTableEmit.next(event);
  }

  public listenToWipeTable(): Observable<any> {
    return this.wipeTableEmit.asObservable();
  }

  //* Imported Stats *//
  public setImportedStats(stats: any) {
    this.importedStats.next(stats);
  }

  public getImportedStats(): Observable<any> {
    return this.importedStats.asObservable();
  }

  //* Set and Gets from race, weaponskill, levels and table *//
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

  public setAmountOfLevels(levels: number): void {
    this.chosenLevels.next(levels);
    this.chosenLevelsSubject.next(levels);
  }

  public getAmountOfLevels(): Observable<number> {
    return this.chosenLevels.asObservable();
  }

  public getAmountOfLevelsSubject(): Observable<number> {
    return this.chosenLevelsSubject.asObservable();
  }
}

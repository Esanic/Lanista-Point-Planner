import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBuild } from '../interfaces/build';

@Injectable({
  providedIn: 'root',
})
export class BuildService {
  private selectedBuild: Subject<IBuild> = new Subject<IBuild>();
  private points: BehaviorSubject<IBuild> = new BehaviorSubject({} as IBuild);

  private chosenRace: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private chosenWeaponSkill: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private importedStats: Subject<any> = new Subject<any>();

  constructor() {}

  public setSelectedBuild(build: IBuild): void {
    this.selectedBuild.next(build);
  }

  public getSelectedBuild(): Observable<IBuild> {
    return this.selectedBuild.asObservable();
  }

  public setBuildFromTable(build: IBuild): void {
    this.points.next(build);
  }

  public getBuildFromTable(): Observable<IBuild> {
    return this.points.asObservable();
  }

  setChosenRace(race: string) {
    this.chosenRace.next(race);
  }

  getChosenRace(): Observable<string> {
    return this.chosenRace.asObservable();
  }

  setChosenWeaponSkill(skill: string) {
    this.chosenWeaponSkill.next(skill);
  }

  getChosenWeaponSkill(): Observable<string> {
    return this.chosenWeaponSkill.asObservable();
  }

  setImportedStats(stats: any) {
    this.importedStats.next(stats);
  }

  getImportedStats(): Observable<any> {
    return this.importedStats.asObservable();
  }
}

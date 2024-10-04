import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IBuild } from '../interfaces/build';
import { IRace } from '../interfaces/race';
import { emptyString } from '../constants/common';
import { defaultRace, dwarf, elf, goblin, human, orc, salamanth, troll, undead } from '../constants/templates';
import { CommonHelper } from '../helpers/common.helper';
import { ArmoryHelper } from '../helpers/armory.helper';

@Injectable({
  providedIn: 'root',
})
export class BuildService {
  private selectedBuild: Subject<IBuild> = new Subject<IBuild>();
  private deslectBuildEmit: Subject<any> = new Subject<any>();
  private selectedBuildVariable: IBuild = {} as IBuild;

  private buildFromTable: BehaviorSubject<IBuild> = new BehaviorSubject({} as IBuild);

  private chosenRace: BehaviorSubject<IRace> = new BehaviorSubject<IRace>({} as IRace);
  private chosenWeaponSkill: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  private chosenLevels: BehaviorSubject<number> = new BehaviorSubject<number>(25);
  private chosenLevelsSubject: Subject<number> = new Subject<number>();
  private importedStats: Subject<any> = new Subject<any>();

  private updateBuildListEmit: Subject<any> = new Subject<any>();
  private wipeDataEmit: Subject<any> = new Subject<any>();
  private wipeTableEmit: Subject<any> = new Subject<any>();

  private human: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(human);
  private elf: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(elf);
  private dwarf: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(dwarf);
  private orc: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(orc);
  private goblin: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(goblin);
  private troll: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(troll);
  private undead: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(undead);
  private salamanth: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(salamanth);
  private default: BehaviorSubject<IRace> = new BehaviorSubject<IRace>(defaultRace);

  constructor(private armoryHelper: ArmoryHelper) {}

  //* Select build *//
  public setSelectedBuild(build: IBuild): void {
    this.selectedBuild.next(build);
    this.selectedBuildVariable = build;
  }

  public getSelectedBuild(): Observable<IBuild> {
    return this.selectedBuild.asObservable();
  }

  //TODO: Should be reworked
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
  public setChosenRace(race: IRace) {
    this.chosenRace.next(race);
  }

  public getChosenRace(): Observable<IRace> {
    return this.chosenRace.asObservable();
  }

  public setChosenWeaponSkill(skill: string) {
    const weaponSkillId = this.armoryHelper.convertWeaponSkillToId(skill.split(' ')[0]);
    this.chosenWeaponSkill.next(weaponSkillId);
  }

  public getChosenWeaponSkill(): Observable<number> {
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

  //#region Races
  //* Human *//
  public setHuman(race: IRace): void {
    this.human.next(race);
  }
  public getHuman(): IRace {
    return this.human.value;
  }

  //* Elf *//
  public setElf(race: IRace): void {
    this.elf.next(race);
  }
  public getElf(): IRace {
    return this.elf.value;
  }

  //* Dwarf *//
  public setDwarf(race: IRace): void {
    this.dwarf.next(race);
  }
  public getDwarf(): IRace {
    return this.dwarf.value;
  }

  //* Orc *//
  public setOrc(race: IRace): void {
    this.orc.next(race);
  }
  public getOrc(): IRace {
    return this.orc.value;
  }

  //* Goblin *//
  public setGoblin(race: IRace): void {
    this.goblin.next(race);
  }
  public getGoblin(): IRace {
    return this.goblin.value;
  }

  //* Troll *//
  public setTroll(race: IRace): void {
    this.troll.next(race);
  }
  public getTroll(): IRace {
    return this.troll.value;
  }

  //* Undead *//
  public setUndead(race: IRace): void {
    this.undead.next(race);
  }
  public getUndead(): IRace {
    return this.undead.value;
  }

  //* Salamanth *//
  public setSalamanth(race: IRace): void {
    this.salamanth.next(race);
  }
  public getSalamanth(): IRace {
    return this.salamanth.value;
  }

  //* Default race *//
  public getDefaultRace(): IRace {
    return this.default.value;
  }

  //* All races *//
  public getRaces(): IRace[] {
    return [this.human.value, this.elf.value, this.dwarf.value, this.orc.value, this.troll.value, this.goblin.value, this.undead.value, this.salamanth.value];
  }
  //#endregion
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { IBuild } from '../interfaces/build';
import { IRace } from '../interfaces/race';
import { defaultRace, dwarf, elf, goblin, human, orc, salamanth, troll, undead } from '../constants/templates';
import { convertWeaponSkillIdToName, convertWeaponSkillNameToId, getGearNamesObject } from '../helpers/armory.helper';
import { ILevel } from '../interfaces/level';
import { ArmoryService } from './armory.service';

@Injectable({
  providedIn: 'root',
})
export class BuildService {
  private selectedBuild: Subject<IBuild> = new Subject<IBuild>();
  private deslectBuildEmit: Subject<any> = new Subject<any>();
  private selectedBuildVariable: IBuild = {} as IBuild;

  // private buildFromTable: BehaviorSubject<IBuild> = new BehaviorSubject({} as IBuild);

  private chosenRace: BehaviorSubject<IRace> = new BehaviorSubject<IRace>({} as IRace);
  private chosenWeaponSkill: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  private levelPoints: BehaviorSubject<ILevel[]> = new BehaviorSubject<ILevel[]>([]);
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

  constructor(private armoryService: ArmoryService) {}

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
    const weaponSkillId = convertWeaponSkillNameToId(skill.split(' ')[0]);
    this.chosenWeaponSkill.next(weaponSkillId);
  }

  public getChosenWeaponSkill(): Observable<number> {
    return this.chosenWeaponSkill.asObservable();
  }

  public setLevelPoints(levels: ILevel[]): void {
    this.levelPoints.next(levels);
  }

  public getLevelPoints(): Observable<ILevel[]> {
    return this.levelPoints.asObservable();
  }

  public setAmountOfLevels(levels: number): void {
    this.chosenLevels.next(levels);
    this.chosenLevelsSubject.next(levels);
  }

  public getAmountOfLevels(): Observable<number> {
    return this.chosenLevels.asObservable();
  }

  //TODO: Evaluate if this is needed
  public getAmountOfLevelsSubject(): Observable<number> {
    return this.chosenLevelsSubject.asObservable();
  }

  public async getCurrentBuild(): Promise<IBuild> {
    const build = {} as IBuild;

    build.race = this.chosenRace.value.name;
    build.weaponSkill = convertWeaponSkillIdToName(this.chosenWeaponSkill.value);
    build.levels = this.levelPoints.value;
    build.equipment = getGearNamesObject(await firstValueFrom(this.armoryService.getGear()));

    return build;
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

  public selectRaceFromRaceName(raceName: string): IRace {
    switch (raceName) {
      case 'Människa': {
        return this.getHuman();
      }
      case 'Alv': {
        return this.getElf();
      }
      case 'Dvärg': {
        return this.getDwarf();
      }
      case 'Ork': {
        return this.getOrc();
      }
      case 'Goblin': {
        return this.getGoblin();
      }
      case 'Troll': {
        return this.getTroll();
      }
      case 'Odöd': {
        return this.getUndead();
      }
      case 'Salamanth': {
        return this.getSalamanth();
      }
      default: {
        return this.getDefaultRace();
      }
    }
  }
}

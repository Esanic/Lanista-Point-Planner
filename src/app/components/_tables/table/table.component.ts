import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILevel } from '../../../support/interfaces/level';
import { GlobalService } from '../../../support/services/global.service';
import { Subscription, debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OnlyNumbersDirective } from '../../../support/directives/only-numbers.directive';
import { IRace } from '../../../support/interfaces/race';
import { BuildService } from '../../../support/services/build.service';
import { IBuild } from '../../../support/interfaces/build';
import { ArmoryService } from '../../../support/services/armory.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, OnlyNumbersDirective],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnDestroy {
  public headers: string[] = this.globalService.headers;
  public levels: ILevel[] = [];
  public desiredLevels: number = 25 + 1;
  public tableForm!: FormGroup;
  public formNames: string[] = ['stamina', 'strength', 'endurance', 'initiative', 'dodge', 'weaponSkill', 'shield', 'learningCapacity', 'luck', 'discipline'];

  public build: IBuild = {} as IBuild;

  // public race: IRace = this.globalService.defaultRace;
  public race: IRace = {} as IRace;
  public weaponSkill: string = '';
  public weaponSkillMultiplier: number = 1;

  public total = this.globalService.total;
  public totalPlacedPoints = 0;
  public totalWithRaceBonus = this.globalService.totalWithRaceBonus;
  public totalWithRaceBonusPlacedPoints = 0;
  private totals: any[] = [this.total, this.totalWithRaceBonus];

  Object = Object;

  private getRace$: Subscription = new Subscription();
  private getWeaponSkill$: Subscription = new Subscription();
  private getLevels$: Subscription = new Subscription();
  private importPoints$: Subscription = new Subscription();
  private wipeData$: Subscription = new Subscription();
  private wipeTable$: Subscription = new Subscription();
  private addBonus$: Subscription = new Subscription();
  private subscriptions: Subscription[] = [this.getRace$, this.getWeaponSkill$, this.importPoints$, this.wipeData$, this.wipeTable$, this.getLevels$, this.addBonus$];

  constructor(private globalService: GlobalService, private formBuilder: FormBuilder, private buildService: BuildService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.createForm();

    this.getRace$ = this.buildService.getChosenRace().subscribe((race) => {
      this.race = race;
      this.racePicker(race.name);
      this.weaponSkillPicker(this.weaponSkill);
      this.summarizeEachColumn();
    });

    this.getWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((skill) => {
      this.weaponSkill = skill.split(' ')[0];
      this.weaponSkillPicker(this.weaponSkill);
      this.summarizeEachColumn();
    });

    this.addBonus$ = this.armoryService.listenBonusesHaveBeenAdded().subscribe(() => {
      this.summarizeEachColumn();
    });

    this.getLevels$ = this.buildService.getAmountOfLevelsSubject().subscribe((levels) => {
      const saveBuild = this.build;

      this.wipeLevels();
      this.addLevels(levels + 1);
      this.addData(saveBuild.levels, true);
      this.subscribeToEachLevel();
      this.setCurrentPoints();
    });

    this.addLevels(25 + 1);
    this.addData();
    this.subscribeToEachLevel();

    this.importPoints$ = this.buildService.getImportedStats().subscribe((levels) => {
      this.getImportedPoints(levels);
    });

    this.wipeData$ = this.buildService.listenWipeData().subscribe(() => {
      this.race = {} as IRace;
      this.wipeTable();
    });

    this.wipeTable$ = this.buildService.listenToWipeTable().subscribe(() => {
      this.wipeTable();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  get tableFormArr(): FormArray {
    return this.tableForm.controls['rows'] as FormArray;
  }

  private createForm(): void {
    this.tableForm = this.formBuilder.group({
      rows: this.formBuilder.array([]),
    });
  }

  private addLevels(levels: number): void {
    for (let i = 1; i < levels; i++) {
      this.levels.push({
        level: i,
        stamina: 0,
        strength: 0,
        endurance: 0,
        initiative: 0,
        dodge: 0,
        weaponSkill: 0,
        shield: 0,
        learningCapacity: 0,
        luck: 0,
        discipline: 0,
        placedPoints: 0,
      });
    }
  }

  private addData(levels?: ILevel[], amountOfLevelsChanged?: boolean): void {
    //* If levels is defined, then we are importing data from a build
    if (levels) {
      //* If amountOfLevelsChanged is true, then we are importing data from a build with a different amount of levels
      if (amountOfLevelsChanged) {
        //* If the imported levels are less than the current levels, then we need to add the missing levels
        if (levels.length < this.levels.length) {
          const missingLevels = this.levels.length - levels.length;

          for (let i = 0; i < missingLevels; i++) {
            levels.push({
              level: levels.length + 1,
              stamina: 0,
              strength: 0,
              endurance: 0,
              initiative: 0,
              dodge: 0,
              weaponSkill: 0,
              shield: 0,
              learningCapacity: 0,
              luck: 0,
              discipline: 0,
              placedPoints: 0,
            });
          }
        }
        //* If the imported levels are more than the current levels, then we need to remove the extra levels
        if (levels.length > this.levels.length) {
          levels = levels.slice(0, this.levels.length);
        }

        levels.forEach((level: ILevel) => {
          this.tableFormArr.push(this.addLevel(level));
        });
      } else {
        this.tableFormArr.clear();
        levels.forEach((level: ILevel) => {
          this.tableFormArr.push(this.addLevel(level));
        });
      }
    } else {
      this.levels.forEach((level) => {
        this.tableFormArr.push(this.addLevel(level));
      });
    }
  }

  private subscribeToEachLevel(): void {
    this.tableFormArr.controls.forEach((control) => {
      control.valueChanges.pipe(debounceTime(200)).subscribe((rowThatChanged) => {
        this.summarizeEachRow(rowThatChanged, control);
        this.summarizeEachColumn();
      });
    });
    this.setCurrentPoints();
  }

  private summarizeEachRow(rowThatChanged: any, control: AbstractControl): void {
    let total = 0;

    Object.entries(rowThatChanged).forEach((attribute: any[]) => {
      // If the attribute value is empty, then set it to 0 to avoid NaN
      if (attribute[1] === '') {
        control.patchValue({ [attribute[0]]: 0 }, { emitEvent: false, onlySelf: true });
        attribute[1] = 0;
      }
      // If the attribute key is not 'level' or 'placedPoints', then add the value to the total
      if (attribute[0] !== 'level' && attribute[0] !== 'placedPoints') {
        total += parseInt(attribute[1]);
      }
    });

    // Set the total to the 'placedPoints' attribute
    control.patchValue({ placedPoints: total }, { emitEvent: false, onlySelf: true });
  }

  private summarizeEachColumn(): void {
    this.total = { ...this.globalService.total };
    this.totalWithRaceBonus = { ...this.globalService.totalWithRaceBonus };

    this.tableFormArr.controls.forEach((level) => {
      Object.entries(level.value).forEach((attribute: any[]) => {
        switch (attribute[0]) {
          case 'stamina':
            this.total.stamina += Math.round(parseInt(attribute[1]));
            this.race.stats
              ? (this.totalWithRaceBonus.stamina += Math.round(parseInt(attribute[1]) * this.race.stats.stamina))
              : (this.totalWithRaceBonus.stamina += Math.round(parseInt(attribute[1])));
            break;
          case 'strength':
            this.total.strength += Math.round(parseInt(attribute[1]));
            this.race.stats
              ? (this.totalWithRaceBonus.strength += Math.round(parseInt(attribute[1]) * this.race.stats.strength))
              : (this.totalWithRaceBonus.strength += Math.round(parseInt(attribute[1])));
            break;
          case 'endurance':
            this.total.endurance += Math.round(parseInt(attribute[1]));
            this.race.stats
              ? (this.totalWithRaceBonus.endurance += Math.round(parseInt(attribute[1]) * this.race.stats.endurance))
              : (this.totalWithRaceBonus.endurance += Math.round(parseInt(attribute[1])));
            break;
          case 'initiative':
            this.total.initiative += Math.round(parseInt(attribute[1]));
            this.race.stats
              ? (this.totalWithRaceBonus.initiative += Math.round(parseInt(attribute[1]) * this.race.stats.initiative))
              : (this.totalWithRaceBonus.initiative += Math.round(parseInt(attribute[1])));
            break;
          case 'dodge':
            this.total.dodge += Math.round(parseInt(attribute[1]));
            this.race.stats ? (this.totalWithRaceBonus.dodge += Math.round(parseInt(attribute[1]) * this.race.stats.dodge)) : (this.totalWithRaceBonus.dodge += Math.round(parseInt(attribute[1])));
            break;
          case 'learningCapacity':
            this.total.learningCapacity += Math.round(parseInt(attribute[1]));
            this.race.stats
              ? (this.totalWithRaceBonus.learningCapacity += Math.round(parseInt(attribute[1]) * this.race.stats.learningCapacity))
              : (this.totalWithRaceBonus.learningCapacity += Math.round(parseInt(attribute[1])));
            break;
          case 'luck':
            this.total.luck += Math.round(parseInt(attribute[1]));
            this.race.stats ? (this.totalWithRaceBonus.luck += Math.round(parseInt(attribute[1]) * this.race.stats.luck)) : (this.totalWithRaceBonus.luck += Math.round(parseInt(attribute[1])));
            break;
          case 'discipline':
            this.total.discipline += Math.round(parseInt(attribute[1]));
            this.race.stats
              ? (this.totalWithRaceBonus.discipline += Math.round(parseInt(attribute[1]) * this.race.stats.discipline))
              : (this.totalWithRaceBonus.discipline += Math.round(parseInt(attribute[1])));
            break;
          case 'weaponSkill':
            this.total.weaponSkill += Math.round(parseInt(attribute[1]));
            this.race.stats
              ? (this.totalWithRaceBonus.weaponSkill += Math.round(parseInt(attribute[1]) * this.weaponSkillMultiplier))
              : (this.totalWithRaceBonus.weaponSkill += Math.round(parseInt(attribute[1])));
            break;
          case 'shield':
            this.total.shield += Math.round(parseInt(attribute[1]));
            this.race.stats
              ? (this.totalWithRaceBonus.shield += Math.round(parseInt(attribute[1]) * this.race.weaponSkills.shield))
              : (this.totalWithRaceBonus.shield += Math.round(parseInt(attribute[1])));
            break;
        }
      });
    });

    this.totalPlacedPoints = Object.values(this.total).reduce((acc, curr) => acc + curr, 0);

    const multiplierBonuses = this.armoryService.getBonusesMultiplier();
    Object.keys(this.totalWithRaceBonus).forEach((key) => {
      this.totalWithRaceBonus[key] = Math.round(this.totalWithRaceBonus[key] * multiplierBonuses[key]);
    });

    const bonuses = this.armoryService.getBonusesAdditive();
    Object.keys(this.totalWithRaceBonus).forEach((key) => {
      this.totalWithRaceBonus[key] += bonuses[key];
    });

    this.totalWithRaceBonusPlacedPoints = Object.values(this.totalWithRaceBonus).reduce((acc, curr) => acc + curr, 0);
  }

  private addLevel(level: ILevel): FormGroup {
    if (level.level === 1) {
      return this.formBuilder.group({
        level: [level.level],
        stamina: [level.stamina],
        strength: [level.strength],
        endurance: [level.endurance],
        initiative: [level.initiative],
        dodge: [level.dodge],
        weaponSkill: [level.weaponSkill],
        shield: [level.shield],
        learningCapacity: [level.learningCapacity],
        luck: [level.luck],
        discipline: [level.discipline],
        placedPoints: [level.placedPoints, [Validators.max(150)]],
      });
    } else {
      return this.formBuilder.group({
        level: [level.level],
        stamina: [level.stamina],
        strength: [level.strength],
        endurance: [level.endurance],
        initiative: [level.initiative],
        dodge: [level.dodge],
        weaponSkill: [level.weaponSkill],
        shield: [level.shield],
        learningCapacity: [level.learningCapacity],
        luck: [level.luck],
        discipline: [level.discipline],
        placedPoints: [level.placedPoints, [Validators.max(20)]],
      });
    }
  }

  private racePicker(race: string): void {
    switch (race) {
      case 'Människa':
        this.race = this.globalService.human;
        break;
      case 'Alv':
        this.race = this.globalService.elf;
        break;
      case 'Dvärg':
        this.race = this.globalService.dwarf;
        break;
      case 'Ork':
        this.race = this.globalService.orc;
        break;
      case 'Goblin':
        this.race = this.globalService.goblin;
        break;
      case 'Troll':
        this.race = this.globalService.troll;
        break;
      case 'Odöd':
        this.race = this.globalService.undead;
        break;
      case 'Salamanth':
        this.race = this.globalService.salamanth;
    }
  }

  private weaponSkillPicker(weaponSkill: string): void {
    if (this.race.weaponSkills) {
      switch (weaponSkill) {
        case 'Yxa':
          this.weaponSkillMultiplier = this.race.weaponSkills.axe;
          break;
        case 'Svärd':
          this.weaponSkillMultiplier = this.race.weaponSkills.sword;
          break;
        case 'Hammare':
          this.weaponSkillMultiplier = this.race.weaponSkills.mace;
          break;
        case 'Stav':
          this.weaponSkillMultiplier = this.race.weaponSkills.stave;
          break;
        case 'Stickvapen':
          this.weaponSkillMultiplier = this.race.weaponSkills.spear;
          break;
        case 'Kätting':
          this.weaponSkillMultiplier = this.race.weaponSkills.chain;
      }
    } else '0';
  }

  private setCurrentPoints(): void {
    let arrOfLevels: ILevel[] = [];
    this.tableFormArr.controls.forEach((control) => {
      let level = {
        level: control.value.level,
        stamina: control.value.stamina,
        strength: control.value.strength,
        endurance: control.value.endurance,
        initiative: control.value.initiative,
        dodge: control.value.dodge,
        weaponSkill: control.value.weaponSkill,
        shield: control.value.shield,
        learningCapacity: control.value.learningCapacity,
        luck: control.value.luck,
        discipline: control.value.discipline,
        placedPoints: control.value.placedPoints,
      };
      arrOfLevels.push(level);
    });

    const build: IBuild = {
      race: this.race.name,
      weaponSkill: this.weaponSkill,
      levels: arrOfLevels,
    };

    this.buildService.setStatsFromTable(build);
    this.build = build;
  }

  private getImportedPoints(levels: any): void {
    this.addData(levels);
    this.subscribeToEachLevel();
    this.summarizeEachColumn();
  }

  private wipeTable(): void {
    this.tableFormArr.clear();
    this.addData();
    this.subscribeToEachLevel();
    this.summarizeEachColumn();
  }

  private wipeLevels(): void {
    this.tableFormArr.clear();
    this.levels = [];
  }

  public getRaceBonusFromWeaponSkill(weaponSkill: string, race: IRace): number {
    return this.globalService.selectRaceBonusFromWeaponSkill(weaponSkill, race);
  }

  public getRaceBonusFromStats(stat: string, race: IRace): number {
    switch (stat) {
      case 'KP': {
        return Math.round((race.stats.stamina - 1) * 100);
      }
      case 'SB': {
        return Math.round((race.stats.strength - 1) * 100);
      }
      case 'UTH': {
        return Math.round((race.stats.endurance - 1) * 100);
      }
      case 'INI': {
        return Math.round((race.stats.initiative - 1) * 100);
      }
      case 'UA': {
        return Math.round((race.stats.dodge - 1) * 100);
      }
      case 'INL': {
        return Math.round((race.stats.learningCapacity - 1) * 100);
      }
      case 'Tur': {
        return Math.round((race.stats.luck - 1) * 100);
      }
      case 'Disc': {
        return Math.round((race.stats.discipline - 1) * 100);
      }
      default: {
        return 0;
      }
    }
  }
}

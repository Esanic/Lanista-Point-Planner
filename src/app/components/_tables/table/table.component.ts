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
  public totalWithRaceBonus = this.globalService.totalWithRaceBonus;
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
      this.totals.forEach((total) => {
        this.summarizeEachColumn(total);
      });
    });

    this.getWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((skill) => {
      this.weaponSkill = skill.split(' ')[0];
      this.weaponSkillPicker(this.weaponSkill);
      this.totals.forEach((total) => {
        this.summarizeEachColumn(total);
      });
    });

    this.addBonus$ = this.armoryService.listenBonusesHaveBeenAdded().subscribe(() => {
      this.totals.forEach((total) => {
        this.summarizeEachColumn(total);
      });
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

  //TODO: Refactor this to make it more generic in order to support custom level intervals
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
        this.totals.forEach((total) => {
          this.summarizeEachColumn(total);
        });
      });
    });
    this.setCurrentPoints();
  }

  private summarizeEachRow(rowThatChanged: any, control: AbstractControl): void {
    let total = 0;

    Object.entries(rowThatChanged).forEach((attribute) => {
      if (attribute[0] !== 'level' && attribute[0] !== 'placedPoints') {
        total += this.typeEvaluation(attribute);
      }
    });

    control.patchValue({ placedPoints: total }, { emitEvent: false, onlySelf: true });
  }

  private summarizeEachColumn(total: any): void {
    if (total.level === 'Total') {
      let stamina: number = 0;
      let strength: number = 0;
      let endurance: number = 0;
      let initiative: number = 0;
      let dodge: number = 0;
      let learningCapacity: number = 0;
      let luck: number = 0;
      let discipline: number = 0;
      let weaponSkill: number = 0;
      let shield: number = 0;

      this.total = {
        level: 'Total',
        stamina: '0',
        strength: '0',
        endurance: '0',
        initiative: '0',
        dodge: '0',
        weaponSkill: '0',
        shield: '0',
        learningCapacity: '0',
        luck: '0',
        discipline: '0',
        placedPoints: '',
      };
      this.tableFormArr.controls.forEach((level) => {
        Object.entries(level.value).forEach((attribute) => {
          switch (attribute[0]) {
            case 'stamina':
              stamina += this.typeEvaluation(attribute);
              this.total.stamina = stamina.toFixed();
              break;
            case 'strength':
              strength += this.typeEvaluation(attribute);
              this.total.strength = strength.toFixed();
              break;
            case 'endurance':
              endurance += this.typeEvaluation(attribute);
              this.total.endurance = endurance.toFixed();
              break;
            case 'initiative':
              initiative += this.typeEvaluation(attribute);
              this.total.initiative = initiative.toFixed();
              break;
            case 'dodge':
              dodge += this.typeEvaluation(attribute);
              this.total.dodge = dodge.toFixed();
              break;
            case 'learningCapacity':
              learningCapacity += this.typeEvaluation(attribute);
              this.total.learningCapacity = learningCapacity.toFixed();
              break;
            case 'luck':
              luck += this.typeEvaluation(attribute);
              this.total.luck = luck.toFixed();
              break;
            case 'discipline':
              discipline += this.typeEvaluation(attribute);
              this.total.discipline = discipline.toFixed();
              break;
            case 'weaponSkill':
              weaponSkill += this.typeEvaluation(attribute);
              this.total.weaponSkill = weaponSkill.toFixed();
              break;
            case 'shield':
              shield += this.typeEvaluation(attribute);
              this.total.shield = shield.toFixed();
              break;
          }
        });
      });
      this.total.placedPoints += (stamina + strength + endurance + initiative + dodge + weaponSkill + shield + learningCapacity + luck + discipline).toFixed();
    }

    if (total.level === 'Total m. rasbonus') {
      let stamina: number = 0;
      let strength: number = 0;
      let endurance: number = 0;
      let initiative: number = 0;
      let dodge: number = 0;
      let learningCapacity: number = 0;
      let luck: number = 0;
      let discipline: number = 0;
      let weaponSkill: number = 0;
      let shield: number = 0;

      this.totalWithRaceBonus = {
        level: 'Total m. rasbonus',
        stamina: '0',
        strength: '0',
        endurance: '0',
        initiative: '0',
        dodge: '0',
        weaponSkill: '0',
        shield: '0',
        learningCapacity: '0',
        luck: '0',
        discipline: '0',
        placedPoints: '',
      };

      this.tableFormArr.controls.forEach((level) => {
        Object.entries(level.value).forEach((attribute) => {
          if (this.race.stats) {
            switch (attribute[0]) {
              case 'stamina':
                stamina += this.typeEvaluation(attribute) * this.race.stats.stamina;
                this.totalWithRaceBonus.stamina = stamina.toFixed();
                break;
              case 'strength':
                strength += this.typeEvaluation(attribute) * this.race.stats.strength;
                this.totalWithRaceBonus.strength = strength.toFixed();
                break;
              case 'endurance':
                endurance += this.typeEvaluation(attribute) * this.race.stats.endurance;
                this.totalWithRaceBonus.endurance = endurance.toFixed();
                break;
              case 'initiative':
                initiative += this.typeEvaluation(attribute) * this.race.stats.initiative;
                this.totalWithRaceBonus.initiative = initiative.toFixed();
                break;
              case 'dodge':
                dodge += this.typeEvaluation(attribute) * this.race.stats.dodge;
                this.totalWithRaceBonus.dodge = dodge.toFixed();
                break;
              case 'learningCapacity':
                learningCapacity += this.typeEvaluation(attribute) * this.race.stats.learningCapacity;
                this.totalWithRaceBonus.learningCapacity = learningCapacity.toFixed();
                break;
              case 'luck':
                luck += this.typeEvaluation(attribute) * this.race.stats.luck;
                this.totalWithRaceBonus.luck = luck.toFixed();
                break;
              case 'discipline':
                discipline += this.typeEvaluation(attribute) * this.race.stats.discipline;
                this.totalWithRaceBonus.discipline = discipline.toFixed();
                break;
              case 'weaponSkill':
                weaponSkill += this.typeEvaluation(attribute) * this.weaponSkillMultiplier;
                this.totalWithRaceBonus.weaponSkill = weaponSkill.toFixed();
                break;
              case 'shield':
                shield += this.typeEvaluation(attribute) * this.race.weaponSkills.shield;
                this.totalWithRaceBonus.shield = shield.toFixed();
                break;
            }
          } else '0';
        });
      });

      const bonuses = this.armoryService.getBonuses();

      this.totalWithRaceBonus.stamina = (parseInt(this.totalWithRaceBonus.stamina) + bonuses.stamina).toFixed();
      this.totalWithRaceBonus.strength = (parseInt(this.totalWithRaceBonus.strength) + bonuses.strength).toFixed();
      this.totalWithRaceBonus.endurance = (parseInt(this.totalWithRaceBonus.endurance) + bonuses.endurance).toFixed();
      this.totalWithRaceBonus.initiative = (parseInt(this.totalWithRaceBonus.initiative) + bonuses.initiative).toFixed();
      this.totalWithRaceBonus.dodge = (parseInt(this.totalWithRaceBonus.dodge) + bonuses.dodge).toFixed();
      this.totalWithRaceBonus.learningCapacity = (parseInt(this.totalWithRaceBonus.learningCapacity) + bonuses.learningCapacity).toFixed();
      this.totalWithRaceBonus.luck = (parseInt(this.totalWithRaceBonus.luck) + bonuses.luck).toFixed();
      this.totalWithRaceBonus.discipline = (parseInt(this.totalWithRaceBonus.discipline) + bonuses.discipline).toFixed();
      this.totalWithRaceBonus.weaponSkill = (parseInt(this.totalWithRaceBonus.weaponSkill) + bonuses.weaponSkill).toFixed();
      this.totalWithRaceBonus.shield = (parseInt(this.totalWithRaceBonus.shield) + bonuses.shield).toFixed();

      this.totalWithRaceBonus.placedPoints = (
        parseInt(this.totalWithRaceBonus.stamina) +
        parseInt(this.totalWithRaceBonus.strength) +
        parseInt(this.totalWithRaceBonus.endurance) +
        parseInt(this.totalWithRaceBonus.initiative) +
        parseInt(this.totalWithRaceBonus.dodge) +
        parseInt(this.totalWithRaceBonus.weaponSkill) +
        parseInt(this.totalWithRaceBonus.shield) +
        parseInt(this.totalWithRaceBonus.learningCapacity) +
        parseInt(this.totalWithRaceBonus.luck) +
        parseInt(this.totalWithRaceBonus.discipline)
      ).toFixed();
    }

    // this.setCurrentPoints();
  }

  private typeEvaluation(attributeToEvaluate: any): number {
    if (typeof attributeToEvaluate[1] === 'string') return +attributeToEvaluate[1];

    if (typeof attributeToEvaluate[1] === 'number') return attributeToEvaluate[1];
    else return 0;
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

  //TODO: Build this object in service instead
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
    this.summarizeEachColumn(this.total);
    this.summarizeEachColumn(this.totalWithRaceBonus);
  }

  private wipeTable(): void {
    this.tableFormArr.clear();
    this.addData();
    this.subscribeToEachLevel();
    this.summarizeEachColumn(this.total);
    this.summarizeEachColumn(this.totalWithRaceBonus);
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILevel } from '../../../support/interfaces/level';
import { Subscription, debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OnlyNumbersDirective } from '../../../support/directives/only-numbers.directive';
import { IAgeModifier, IRace } from '../../../support/interfaces/race';
import { BuildService } from '../../../support/services/build.service';
import { IBuild } from '../../../support/interfaces/build';
import { ArmoryService } from '../../../support/services/armory.service';
import { emptyString } from '../../../support/constants/common';
import { tableHeaders } from '../../../support/constants/headers';
import { total } from '../../../support/constants/templates';
import { weaponSkills } from '../../../support/enums/weapon-skills.enums';

import { WeaponSkillsPipe } from '../../../support/pipes/weapon-skills.pipe';
import { selectRaceBonusFromWeaponSkill } from '../../../support/helpers/build.helper';
import { convertWeaponSkillIdToName } from '../../../support/helpers/armory.helper';
import { ITotal } from '../../../support/interfaces/total';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, OnlyNumbersDirective, WeaponSkillsPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnDestroy {
  Object = Object;

  public headers: string[] = tableHeaders;
  public tableForm!: FormGroup;
  public formNames: string[] = ['stamina', 'strength', 'endurance', 'initiative', 'dodge', 'weaponSkill', 'shield'];

  public levels: ILevel[] = [];
  private savedLevelPoints: ILevel[] = [];
  public race: IRace = {} as IRace;
  public age: IAgeModifier = {} as IAgeModifier;

  public weaponSkill: number = -1;
  public weaponSkillMultiplier: number = 1;

  public total: ITotal = { ...total };
  public totalPlacedPoints: number = 0;
  public totalWithBonuses: ITotal = { ...total };
  public totalWithBonusesPlacedPoints: number = 0;

  private shieldBuild: boolean = false;

  private getRace$: Subscription = new Subscription();
  private getAge$: Subscription = new Subscription();
  private getWeaponSkill$: Subscription = new Subscription();
  private getLevels$: Subscription = new Subscription();
  private importPoints$: Subscription = new Subscription();
  private wipeData$: Subscription = new Subscription();
  private wipeTable$: Subscription = new Subscription();
  private addBonus$: Subscription = new Subscription();
  private subscriptions: Subscription[] = [this.getRace$, this.getWeaponSkill$, this.importPoints$, this.wipeData$, this.wipeTable$, this.getLevels$, this.addBonus$];

  constructor(private formBuilder: FormBuilder, private buildService: BuildService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.createForm();

    this.getRace$ = this.buildService.getChosenRace().subscribe((race) => {
      this.race = race;
      this.weaponSkillPicker(this.weaponSkill);
      this.summarizeEachColumn();
    });

    this.getAge$ = this.buildService.getChosenAge().subscribe((age) => {
      if (this.race.ageModifications !== undefined) {
        this.age = this.race.ageModifications.find((a) => a.name === age) as IAgeModifier;
        this.summarizeEachColumn();
      }
    });

    this.getWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      this.weaponSkill = weaponSkill;
      this.weaponSkillPicker(this.weaponSkill);
      this.summarizeEachColumn();
    });

    this.addBonus$ = this.armoryService.listenBonusesHaveBeenAdded().subscribe(() => {
      this.summarizeEachColumn();
    });

    this.getLevels$ = this.buildService.getAmountOfLevels().subscribe((levels) => {
      this.wipeLevels();
      this.addLevels(levels + 1);
      this.addData(this.savedLevelPoints, true);
      this.subscribeToEachLevel();
      this.setCurrentPoints();
    });

    this.importPoints$ = this.buildService.getImportedLevelPoints().subscribe((levels) => {
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
        this.summarizeEachColumn().then(() => {
          this.setCurrentPoints();
        });
      });
    });
  }

  private summarizeEachRow(rowThatChanged: any, control: AbstractControl): void {
    let total = 0;

    Object.entries(rowThatChanged).forEach((attribute: any[]) => {
      //* If the attribute value is empty, then set it to 0 to avoid NaN
      if (attribute[1] === emptyString) {
        control.patchValue({ [attribute[0]]: 0 }, { emitEvent: false, onlySelf: true });
        attribute[1] = 0;
      }
      //* If the attribute key is not 'level' or 'placedPoints', then add the value to the total
      if (attribute[0] !== 'level' && attribute[0] !== 'placedPoints') {
        total += parseInt(attribute[1]);
      }
    });

    //* Set the total to the 'placedPoints' attribute
    control.patchValue({ placedPoints: total }, { emitEvent: false, onlySelf: true });
  }

  private summarizeEachColumn(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.total = { ...total };
      this.totalWithBonuses = { ...total };

      this.tableFormArr.controls.forEach((level) => {
        Object.entries(level.value).forEach((attribute: any[]) => {
          switch (attribute[0]) {
            case 'stamina':
              this.total.stamina += Math.round(parseInt(attribute[1]));
              this.race.stats ? (this.totalWithBonuses.stamina += Math.round(parseInt(attribute[1]) * this.race.stats.stamina)) : (this.totalWithBonuses.stamina += Math.round(parseInt(attribute[1])));
              break;
            case 'strength':
              this.total.strength += Math.round(parseInt(attribute[1]));
              this.race.stats
                ? (this.totalWithBonuses.strength += Math.round(parseInt(attribute[1]) * this.race.stats.strength))
                : (this.totalWithBonuses.strength += Math.round(parseInt(attribute[1])));
              break;
            case 'endurance':
              this.total.endurance += Math.round(parseInt(attribute[1]));
              this.race.stats
                ? (this.totalWithBonuses.endurance += Math.round(parseInt(attribute[1]) * this.race.stats.endurance))
                : (this.totalWithBonuses.endurance += Math.round(parseInt(attribute[1])));
              break;
            case 'initiative':
              this.total.initiative += Math.round(parseInt(attribute[1]));
              this.race.stats
                ? (this.totalWithBonuses.initiative += Math.round(parseInt(attribute[1]) * this.race.stats.initiative))
                : (this.totalWithBonuses.initiative += Math.round(parseInt(attribute[1])));
              break;
            case 'dodge':
              this.total.dodge += Math.round(parseInt(attribute[1]));
              this.race.stats ? (this.totalWithBonuses.dodge += Math.round(parseInt(attribute[1]) * this.race.stats.dodge)) : (this.totalWithBonuses.dodge += Math.round(parseInt(attribute[1])));
              break;
            case 'weaponSkill':
              this.total.weaponSkill += Math.round(parseInt(attribute[1]));
              this.race.stats
                ? (this.totalWithBonuses.weaponSkill += Math.round(parseInt(attribute[1]) * this.weaponSkillMultiplier))
                : (this.totalWithBonuses.weaponSkill += Math.round(parseInt(attribute[1])));
              break;
            case 'shield':
              this.total.shield += Math.round(parseInt(attribute[1]));
              this.race.stats
                ? (this.totalWithBonuses.shield += Math.round(parseInt(attribute[1]) * this.race.weaponSkills.shield))
                : (this.totalWithBonuses.shield += Math.round(parseInt(attribute[1])));
              break;
          }
        });
      });

      this.totalPlacedPoints = Object.values(this.total).reduce((acc, curr) => acc + curr, 0);

      if (this.total.shield > 0) {
        if (!this.shieldBuild) {
          this.shieldBuild = true;
          this.armoryService.setShieldBuild(true);
        }
      }
      if (this.total.shield === 0) {
        if (this.shieldBuild) {
          this.shieldBuild = false;
          this.armoryService.setShieldBuild(false);
        }
      }

      //! Use this if +% from equipment is applied after racial bonus
      // const multiplierBonuses = this.armoryService.getBonusesMultiplier();
      // Object.keys(this.totalWithRaceBonus).forEach((key) => {
      //   this.totalWithRaceBonus[key] = Math.round(this.totalWithRaceBonus[key] * multiplierBonuses[key]);
      // });

      //! Use this if racial bonus is applied after the multiplier bonus from equipment
      const multiplierBonuses = this.armoryService.getBonusesMultiplier();
      Object.keys(this.total).forEach((key) => {
        this.totalWithBonuses[key] = Math.round(this.total[key] * multiplierBonuses[key] + (this.totalWithBonuses[key] - this.total[key]));
      });

      //* Add the additive bonuses from equipment
      const bonuses = this.armoryService.getBonusesAdditive();
      Object.keys(this.totalWithBonuses).forEach((key) => {
        this.totalWithBonuses[key] += bonuses[key];
      });

      //* Calculate the total placed points with bonuses applied
      this.totalWithBonusesPlacedPoints = Object.values(this.totalWithBonuses).reduce((acc, curr) => acc + curr, 0);

      resolve();
    });
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
        placedPoints: [level.placedPoints, [Validators.max(20)]],
      });
    }
  }

  private weaponSkillPicker(weaponSkill: number): void {
    if (this.race.weaponSkills) {
      switch (weaponSkill) {
        case weaponSkills.Axe:
          this.weaponSkillMultiplier = this.race.weaponSkills.axe;
          break;
        case weaponSkills.Sword:
          this.weaponSkillMultiplier = this.race.weaponSkills.sword;
          break;
        case weaponSkills.Mace:
          this.weaponSkillMultiplier = this.race.weaponSkills.mace;
          break;
        case weaponSkills.Stave:
          this.weaponSkillMultiplier = this.race.weaponSkills.stave;
          break;
        case weaponSkills.Spear:
          this.weaponSkillMultiplier = this.race.weaponSkills.spear;
          break;
        case weaponSkills.Chain:
          this.weaponSkillMultiplier = this.race.weaponSkills.chain;
      }
    } else -1;
  }

  private setCurrentPoints(): void {
    let arrOfLevels: ILevel[] = [];
    this.tableFormArr.controls.forEach((control) => {
      const level = {
        level: Number(control.value.level),
        stamina: Number(control.value.stamina),
        strength: Number(control.value.strength),
        endurance: Number(control.value.endurance),
        initiative: Number(control.value.initiative),
        dodge: Number(control.value.dodge),
        weaponSkill: Number(control.value.weaponSkill),
        shield: Number(control.value.shield),
        // learningCapacity: Number(control.value.learningCapacity),
        // luck: Number(control.value.luck),
        // discipline: Number(control.value.discipline),
        placedPoints: Number(control.value.placedPoints),
      };
      arrOfLevels.push(level);
    });

    this.savedLevelPoints = arrOfLevels;

    this.buildService.setLevelPoints(arrOfLevels);
  }

  private getImportedPoints(levels: any): void {
    this.addData(levels);
    this.subscribeToEachLevel();
    this.summarizeEachColumn().then(() => {
      this.setCurrentPoints();
    });
    this.setCurrentPoints();
  }

  private wipeTable(): void {
    this.tableFormArr.clear();
    this.addData();
    this.subscribeToEachLevel();
    this.summarizeEachColumn().then(() => {
      this.setCurrentPoints();
    });
  }

  private wipeLevels(): void {
    this.tableFormArr.clear();
    this.levels = [];
  }

  public getRaceBonusFromWeaponSkill(weaponSkill: number, race: IRace): number {
    const weaponSkillName = convertWeaponSkillIdToName(weaponSkill);
    return selectRaceBonusFromWeaponSkill(weaponSkillName, race);
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
      case 'Sköld': {
        return Math.round((race.weaponSkills.shield - 1) * 100);
      }
      default: {
        return 0;
      }
    }
  }

  public getAgeBonusFromStats(stat: string, age: IAgeModifier): number {
    switch (stat) {
      case 'KP': {
        return Math.round((age.stamina - 1) * 100);
      }
      case 'SB': {
        return Math.round((age.strength - 1) * 100);
      }
      case 'UTH': {
        return Math.round((age.endurance - 1) * 100);
      }
      case 'INI': {
        return Math.round((age.initiative - 1) * 100);
      }
      case 'UA': {
        return Math.round((age.dodge - 1) * 100);
      }
      case 'Sköld': {
        return Math.round((age.shield - 1) * 100);
      }
      case 'Yxa':
      case 'Svärd':
      case 'Hammare':
      case 'Stav':
      case 'Stick':
      case 'Kätting': {
        return Math.round((age.weaponSkill - 1) * 100);
      }
      default: {
        return 0;
      }
    }
  }

  public convertWeaponSkillIdToName(weaponSkill: number): string {
    return convertWeaponSkillIdToName(weaponSkill);
  }
}

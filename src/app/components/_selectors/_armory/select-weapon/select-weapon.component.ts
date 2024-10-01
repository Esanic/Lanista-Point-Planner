import { Component, Input } from '@angular/core';
import { weaponSkillStr } from '../../../../support/enums/weapon-skills.enums';
import { additiveBonus, multiplierBonus } from '../../../../support/constants/templates';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { IWeapon } from '../../../../support/interfaces/_armory/weapon';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { emptyString } from '../../../../support/constants/common';
import { ArmoryHelper } from '../../../../support/helpers/armory.helper';
import { Races } from '../../../../support/enums/races';

@Component({
  selector: 'app-select-weapon',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-weapon.component.html',
  styleUrl: './select-weapon.component.css',
})
export class SelectWeaponComponent {
  @Input() isOffhand: boolean = false;

  public chosenWeapon = new FormControl({ value: emptyString, disabled: true });

  private selectedWeaponSkill: string = emptyString;
  private selectedRace: string = emptyString;
  private currentMaxLevel: number = 25;
  private viewLegendEquipment: boolean = false;
  private shieldBuild: boolean = false;
  public twoHandedBuild: boolean = false;

  public weaponArray: BehaviorSubject<IWeapon[]> = new BehaviorSubject<IWeapon[]>([]);

  private chosenWeaponSkill$: Subscription = new Subscription();
  private chosenRace$: Subscription = new Subscription();
  private incomingWeapon$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();
  private tableStats$: Subscription = new Subscription();
  private shieldBuild$: Subscription = new Subscription();
  private twoHandedBuild$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService, private armoryHelper: ArmoryHelper) {}

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      if (weaponSkill) {
        this.selectedWeaponSkill = weaponSkill;
        this.chosenWeapon.enable();
        this.chosenWeapon.patchValue(emptyString);
        this.selectWeaponArray(this.selectedWeaponSkill);
      }
    });

    this.chosenRace$ = this.buildService.getChosenRace().subscribe((race) => {
      if (race) {
        this.selectedRace = race.name;
        this.selectWeaponArray(this.selectedWeaponSkill);
      }
    });

    this.shieldBuild$ = this.armoryService.listenShieldBuild().subscribe((shieldBuild) => {
      if (this.isOffhand && shieldBuild) {
        this.chosenWeapon.patchValue(emptyString);
        this.resetBonus();
        this.shieldBuild = shieldBuild;
        this.selectOffhand();
      }
    });

    this.twoHandedBuild$ = this.armoryService.listenTwoHandedBuild().subscribe((twoHandedBuild) => {
      this.twoHandedBuild = twoHandedBuild;
      if (this.isOffhand && this.twoHandedBuild) {
        this.chosenWeapon.patchValue(emptyString);
        this.resetBonus();
      }
    });

    this.viewLegendEquipment$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((legendEquipmentViewStatus) => {
      this.viewLegendEquipment = legendEquipmentViewStatus;
      this.selectOffhand();
    });

    this.tableStats$ = this.buildService.getStatsFromTable().subscribe((stats) => {
      if (stats.levels) {
        this.currentMaxLevel = stats.levels.length;
        this.selectOffhand();
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenWeapon.patchValue(emptyString);
    });

    this.chosenWeapon.valueChanges.subscribe((selectedWeapon) => {
      //* If no weapon is selected, reset bonuses and emit that two handed weapon is not selected
      if (selectedWeapon === 'none') {
        this.armoryService.emitTwoHandedBuild(false);
        this.resetBonus();
        return;
      }

      const chosenWeapon = this.weaponArray.value.find((weapon) => weapon.name === selectedWeapon);

      if (chosenWeapon) {
        const bonusToAdd: ITotalBonus = this.armoryHelper.calculateBonusesFromEquipment(chosenWeapon, this.selectedWeaponSkill);

        //* If two handed weapon is selected, emit that event
        if (chosenWeapon.is_two_handed) {
          this.armoryService.emitTwoHandedBuild(true);
          this.resetBonus();
        } else {
          this.armoryService.emitTwoHandedBuild(false);
          this.resetBonus();
        }

        if (this.isOffhand) {
          this.armoryService.addBonus('offhand', bonusToAdd);
          this.armoryService.setGear('offhand', chosenWeapon);
        } else {
          this.armoryService.addBonus('mainhand', bonusToAdd);
          this.armoryService.setGear('mainhand', chosenWeapon);
        }

        this.armoryService.emitBonusesHaveBeenAdded();
      } else {
        this.resetBonus();
      }
    });

    this.incomingWeapon$ = this.armoryService.getGear().subscribe((gear) => {
      if (this.isOffhand) {
        const offHand = this.weaponArray.value.find((weapon) => weapon.name === gear.offhand.name);
        if (offHand) this.chosenWeapon.patchValue(offHand.name, { emitEvent: false });
      } else {
        const mainHand = this.weaponArray.value.find((weapon) => weapon.name === gear.mainhand.name);
        if (mainHand) this.chosenWeapon.patchValue(mainHand.name, { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    this.chosenWeaponSkill$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
    this.tableStats$.unsubscribe();
    this.shieldBuild$.unsubscribe();
    this.wipeBonus$.unsubscribe();
    this.twoHandedBuild$.unsubscribe();
    this.incomingWeapon$.unsubscribe();
  }

  private resetBonus(): void {
    if (this.isOffhand) {
      this.armoryService.addBonus('offhand', {
        additiveBonus: additiveBonus,
        multiplierBonus: multiplierBonus,
      });
    } else {
      this.armoryService.addBonus('mainhand', {
        additiveBonus: additiveBonus,
        multiplierBonus: multiplierBonus,
      });
    }
    this.armoryService.emitBonusesHaveBeenAdded();
  }

  //* If shieldBuild is true, then shield is selected, otherwise the selectedWeaponSkill is selected
  private selectOffhand(): void {
    if (this.shieldBuild) {
      this.selectWeaponArray(weaponSkillStr.Shield);
    } else {
      this.selectWeaponArray(this.selectedWeaponSkill);
    }
  }

  private selectWeaponArray(weaponSkill: string): void {
    switch (weaponSkill) {
      case weaponSkillStr.Axe: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.axe, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Sword: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.sword, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Mace: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.mace, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Stave: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.stave, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Spear: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.spear, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Chain: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.chain, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Shield: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.shield, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
    }
  }

  private filterAndRenameWeapons(weapons: IWeapon[], currentMaxLevel: number, showLegendEquipment: boolean, isOffhand?: boolean): IWeapon[] {
    const weaponsArray = JSON.parse(JSON.stringify(weapons));

    let filteredWeapons: IWeapon[] = [];

    if (showLegendEquipment) {
      if (isOffhand) {
        filteredWeapons = weaponsArray.filter((weapon: IWeapon) => !weapon.is_two_handed && weapon.required_level <= currentMaxLevel);
      } else {
        filteredWeapons = weaponsArray.filter((equipment: IWeapon) => equipment.required_level <= currentMaxLevel);
      }
    } else {
      if (isOffhand) {
        filteredWeapons = weaponsArray.filter((weapon: IWeapon) => !weapon.is_two_handed && !weapon.requires_legend && !weapon.is_two_handed && weapon.required_level <= currentMaxLevel);
      } else {
        filteredWeapons = weaponsArray.filter((equipment: IWeapon) => !equipment.requires_legend && equipment.required_level <= currentMaxLevel);
      }
    }

    switch (this.selectedRace) {
      case 'Människa': {
        filteredWeapons = this.filterWeaponsByRace(filteredWeapons, Races.human);
        break;
      }
      case 'Dvärg': {
        filteredWeapons = this.filterWeaponsByRace(filteredWeapons, Races.dwarf);
        break;
      }
      case 'Alv': {
        filteredWeapons = this.filterWeaponsByRace(filteredWeapons, Races.elf);
        break;
      }
      case 'Ork': {
        filteredWeapons = this.filterWeaponsByRace(filteredWeapons, Races.orc);
        break;
      }
      case 'Goblin': {
        filteredWeapons = this.filterWeaponsByRace(filteredWeapons, Races.goblin);
        break;
      }
      case 'Troll': {
        filteredWeapons = this.filterWeaponsByRace(filteredWeapons, Races.troll);
        break;
      }
      case 'Odöd': {
        filteredWeapons = this.filterWeaponsByRace(filteredWeapons, Races.undead);
        break;
      }
      case 'Salamanth': {
        filteredWeapons = this.filterWeaponsByRace(filteredWeapons, Races.salamanth);
      }
    }

    const renamedWeapons: IWeapon[] = filteredWeapons.map((weapon) => {
      weapon.name = `${weapon.name} (G${weapon.required_level}${weapon.max_level ? '-' + weapon.max_level : emptyString}) ${weapon.requires_legend ? '(L)' : emptyString}`;
      return weapon;
    });

    const sortedWeapons = renamedWeapons.sort((a, b) => a.required_level - b.required_level);

    return sortedWeapons;
  }

  /**
   * Helper function to filter weapons by race.
   *
   * If the weapon has no requirements, it will be included in the filtered array.
   *
   * If the weapon has requirements and any of them have `requirementable` set to 'App\\Models\\Race',  it will look if any of the requirements have the same `requirementable_id` as the `raceId`.
   *
   * If the weapon has requirements and none of them have `requirementable` set to 'App\\Models\\Race', it will be included in the filtered array.
   *
   * @param weapons
   * @param raceId
   * @returns array of filtered weapons
   */
  private filterWeaponsByRace(weapons: IWeapon[], raceId: number): IWeapon[] {
    return (weapons = weapons.filter((weapon) => {
      if (weapon.requirements.length === 0) return true;

      if (weapon.requirements.some((requirement) => requirement.requirementable === 'App\\Models\\Race')) {
        return weapon.requirements.some((requirement) => {
          return requirement.requirementable_id === raceId && requirement.requirementable === 'App\\Models\\Race';
        });
      } else {
        return true;
      }
    }));
  }
}

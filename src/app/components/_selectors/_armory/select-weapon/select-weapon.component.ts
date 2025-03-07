import { Component, Input } from '@angular/core';
import { weaponSkillStr, weaponSkills } from '../../../../support/enums/weapon-skills.enums';
import { additiveBonus, gearTemplate, multiplierBonus, weaponTemplate } from '../../../../support/constants/templates';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { IWeapon } from '../../../../support/interfaces/_armory/weapon';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { emptyString } from '../../../../support/constants/common';
import { Races } from '../../../../support/enums/races';
import { calculateBonusesFromEquipment } from '../../../../support/helpers/armory.helper';
import { deepCopy } from '../../../../support/helpers/common.helper';
import { IGearNames } from '../../../../support/interfaces/_armory/gear';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-weapon',
  standalone: true,
  imports: [ReactiveFormsModule, NgbTooltipModule],
  templateUrl: './select-weapon.component.html',
  styleUrl: './select-weapon.component.css',
})
export class SelectWeaponComponent {
  @Input() isOffhand: boolean = false;

  public chosenWeapon = new FormControl({ value: emptyString, disabled: true });

  private selectedWeaponSkill: number = -1;
  private selectedRace: number = 0;
  private currentMaxLevel: number = 25;
  private viewLegendEquipment: boolean = false;
  private shieldBuild: boolean = false;
  public twoHandedBuild: boolean = false;

  public weaponArray: BehaviorSubject<IWeapon[]> = new BehaviorSubject<IWeapon[]>([]);

  private chosenWeaponSkill$: Subscription = new Subscription();
  private chosenRace$: Subscription = new Subscription();
  private shieldBuild$: Subscription = new Subscription();
  private twoHandedBuild$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();
  private maxLevel$: Subscription = new Subscription();
  private chosenWeapon$: Subscription = new Subscription();
  private incomingWeapon$: Subscription = new Subscription();
  private importedWeapon$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      if (weaponSkill !== -1) {
        this.selectedWeaponSkill = weaponSkill;
        this.chosenWeapon.enable();
        this.chosenWeapon.patchValue(emptyString);
        this.selectWeaponArray(this.selectedWeaponSkill);
      }
    });

    this.chosenRace$ = this.buildService.getChosenRace().subscribe((race) => {
      if (race) {
        this.selectedRace = race.id;
        this.selectWeaponArray(this.selectedWeaponSkill);
      }
    });

    this.shieldBuild$ = this.armoryService.getShieldBuild().subscribe((shieldBuild) => {
      this.shieldBuild = shieldBuild;
      if (this.isOffhand && this.shieldBuild) {
        this.chosenWeapon.patchValue(emptyString);
        this.resetBonus();
        this.selectOffhandArray();
      } else {
        if (this.shieldBuild && this.twoHandedBuild && !this.isOffhand) {
          this.chosenWeapon.patchValue(emptyString);
          this.resetBonus();
        }
        this.selectWeaponArray(this.selectedWeaponSkill);
      }
    });

    this.twoHandedBuild$ = this.armoryService.getTwoHandedBuild().subscribe((twoHandedBuild) => {
      this.twoHandedBuild = twoHandedBuild;
      if (this.isOffhand && this.twoHandedBuild) {
        this.chosenWeapon.patchValue(emptyString);
        this.resetBonus();
      }
    });

    this.viewLegendEquipment$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((legendEquipmentViewStatus) => {
      this.viewLegendEquipment = legendEquipmentViewStatus;
      this.selectOffhandArray();
    });

    this.maxLevel$ = this.buildService.getAmountOfLevels().subscribe((levels) => {
      if (levels) {
        this.currentMaxLevel = levels;
        this.selectOffhandArray();
      }
    });

    this.chosenWeapon$ = this.chosenWeapon.valueChanges.subscribe((selectedWeapon) => {
      if (selectedWeapon === '') {
        this.resetBonus();
        return;
      }

      //* If no weapon is selected, reset bonuses and emit that two handed weapon is not selected
      if (selectedWeapon === 'none') {
        this.armoryService.setTwoHandedBuild(false);
        this.resetBonus();
        return;
      }

      const chosenWeapon = this.weaponArray.value.find((weapon) => weapon.name === selectedWeapon);

      if (chosenWeapon) {
        const bonusToAdd: ITotalBonus = calculateBonusesFromEquipment(chosenWeapon, this.selectedWeaponSkill);

        //* If two handed weapon is selected, emit that event
        if (chosenWeapon.is_two_handed) {
          this.armoryService.setTwoHandedBuild(true);
          this.resetBonus();
        } else {
          this.armoryService.setTwoHandedBuild(false);
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

        if (gear.offhand === weaponTemplate) this.chosenWeapon.patchValue(emptyString, { emitEvent: false });
      } else {
        const mainHand = this.weaponArray.value.find((weapon) => weapon.name === gear.mainhand.name);
        if (mainHand) this.chosenWeapon.patchValue(mainHand.name, { emitEvent: false });

        if (gear.mainhand === weaponTemplate) this.chosenWeapon.patchValue(emptyString, { emitEvent: false });
      }
    });

    this.importedWeapon$ = this.armoryService.getImportedGear().subscribe((gearNames) => {
      if (Object.keys(gearNames).length === 0) return;

      if (this.isOffhand) {
        const importedOffhand = this.weaponArray.value.find((weapon) => weapon.name.split('(')[0].trimEnd() == gearNames.offhand);
        this.handleImportedWeapon(importedOffhand, 'offhand');
      } else {
        const importedMainhand = this.weaponArray.value.find((weapon) => weapon.name.split('(')[0].trimEnd() == gearNames.mainhand);
        this.handleImportedWeapon(importedMainhand, 'mainhand');
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenWeapon.patchValue(emptyString);
    });
  }

  ngOnDestroy(): void {
    this.chosenWeaponSkill$.unsubscribe();
    this.chosenRace$.unsubscribe();
    this.shieldBuild$.unsubscribe();
    this.twoHandedBuild$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
    this.maxLevel$.unsubscribe();
    this.chosenWeapon$.unsubscribe();
    this.incomingWeapon$.unsubscribe();
    this.importedWeapon$.unsubscribe();
    this.wipeBonus$.unsubscribe();
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
  private selectOffhandArray(): void {
    if (this.shieldBuild && this.isOffhand) {
      this.selectWeaponArray(weaponSkills.Shield);
    } else {
      this.selectWeaponArray(this.selectedWeaponSkill);
    }
  }

  private selectWeaponArray(weaponSkill: number): void {
    switch (weaponSkill) {
      case weaponSkills.Axe: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.axe, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkills.Sword: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.sword, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkills.Mace: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.mace, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkills.Stave: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.stave, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkills.Spear: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.spear, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkills.Chain: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.chain, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkills.Shield: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.armoryService.shield, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
    }
  }

  private filterAndRenameWeapons(weapons: IWeapon[], currentMaxLevel: number, showLegendEquipment: boolean, isOffhand?: boolean): IWeapon[] {
    const weaponsArray = deepCopy(weapons);

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

    if (this.shieldBuild) {
      filteredWeapons = filteredWeapons.filter((weapon: IWeapon) => !weapon.is_two_handed);
    }

    filteredWeapons = this.filterWeaponsByRace(filteredWeapons, this.selectedRace);

    const renamedWeapons: IWeapon[] = filteredWeapons.map((weapon) => {
      weapon.name = `${weapon.name} (G${weapon.required_level}${weapon.max_level ? '-' + weapon.max_level : emptyString}) ${weapon.requires_legend ? '(L)' : emptyString}`;
      return weapon;
    });

    const sortedWeapons = renamedWeapons.sort((a, b) => a.required_level - b.required_level);

    const trimmedWeapons = sortedWeapons.map((weapon) => {
      weapon.name = weapon.name.trim();
      return weapon;
    });

    return trimmedWeapons;
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

  /** Helper function to handle the imported weapons
   *
   * @param weapon - The imported weapon
   * @param gearSlot - The gear slot to set the weapon to
   */
  private handleImportedWeapon(weapon: IWeapon | undefined, gearSlot: string): void {
    if (weapon) {
      this.chosenWeapon.patchValue(weapon.name);
      this.armoryService.setGear(gearSlot, weapon);
    } else {
      this.chosenWeapon.patchValue(emptyString);
      this.armoryService.setGear(gearSlot, weaponTemplate);
    }
  }
}

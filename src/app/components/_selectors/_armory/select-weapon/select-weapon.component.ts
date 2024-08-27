import { Component, Input } from '@angular/core';
import { weaponSkillStr } from '../../../../support/enums/weapon-skills.enums';
import { additiveBonus, multiplierBonus } from '../../../../support/constants/bonuses';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { IWeapon } from '../../../../support/interfaces/_armory/weapon';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { GlobalService } from '../../../../support/services/global.service';
import { emptyString } from '../../../../support/constants/global';
import { ArmoryHelper } from '../../../../support/helpers/armory.helper';

@Component({
  selector: 'app-select-weapon',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-weapon.component.html',
  styleUrl: './select-weapon.component.css',
})
export class SelectWeaponComponent {
  @Input() isOffhand: boolean = false;

  public chosenWeapon = new FormControl(emptyString);

  private selectedWeaponSkill: string = emptyString;
  private currentMaxLevel: number = 25;
  private viewLegendEquipment: boolean = false;
  private shieldBuild: boolean = false;
  public twoHandedBuild: boolean = false;

  public weaponArray: BehaviorSubject<IWeapon[]> = new BehaviorSubject<IWeapon[]>([]);

  private chosenWeaponSkill$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();
  private tableStats$: Subscription = new Subscription();
  private shieldBuild$: Subscription = new Subscription();
  private twoHandedBuild$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private globalService: GlobalService, private armoryService: ArmoryService, private armoryHelper: ArmoryHelper) {}

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      this.selectedWeaponSkill = weaponSkill.split(' ')[0];
      this.chosenWeapon.patchValue(emptyString);
      this.selectWeaponArray(this.selectedWeaponSkill);
    });

    this.shieldBuild$ = this.armoryService.listenShieldBuild().subscribe((shieldBuild) => {
      if (this.isOffhand) {
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
        } else this.armoryService.addBonus('mainhand', bonusToAdd);

        this.armoryService.emitBonusesHaveBeenAdded();
      } else {
        this.resetBonus();
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
        this.weaponArray.next(this.filterAndRenameWeapons(this.globalService.axe, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Sword: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.globalService.sword, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Mace: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.globalService.mace, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Stave: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.globalService.stave, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Spear: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.globalService.spear, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Chain: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.globalService.chain, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Shield: {
        this.weaponArray.next(this.filterAndRenameWeapons(this.globalService.shield, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
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

    const renamedWeapons: IWeapon[] = filteredWeapons.map((weapon) => {
      weapon.name = `${weapon.name} (G${weapon.required_level}${weapon.max_level ? '-' + weapon.max_level : emptyString}) ${weapon.requires_legend ? '(L)' : emptyString}`;
      return weapon;
    });

    const sortedWeapons = renamedWeapons.sort((a, b) => a.required_level - b.required_level);

    return sortedWeapons;
  }
}

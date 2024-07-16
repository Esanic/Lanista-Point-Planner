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

  constructor(private buildService: BuildService, private globalService: GlobalService, private armoryService: ArmoryService) {}

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
        const bonusToAdd: ITotalBonus = this.armoryService.calculateBonusesFromEquipment(chosenWeapon, this.selectedWeaponSkill);

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
        this.weaponArray.next(this.armoryService.filterAndRenameWeapons(this.globalService.axe, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Sword: {
        this.weaponArray.next(this.armoryService.filterAndRenameWeapons(this.globalService.sword, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Mace: {
        this.weaponArray.next(this.armoryService.filterAndRenameWeapons(this.globalService.mace, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Stave: {
        this.weaponArray.next(this.armoryService.filterAndRenameWeapons(this.globalService.stave, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Spear: {
        this.weaponArray.next(this.armoryService.filterAndRenameWeapons(this.globalService.spear, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Chain: {
        this.weaponArray.next(this.armoryService.filterAndRenameWeapons(this.globalService.chain, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
      case weaponSkillStr.Shield: {
        this.weaponArray.next(this.armoryService.filterAndRenameWeapons(this.globalService.shield, this.currentMaxLevel, this.viewLegendEquipment, this.isOffhand));
        break;
      }
    }
  }
}

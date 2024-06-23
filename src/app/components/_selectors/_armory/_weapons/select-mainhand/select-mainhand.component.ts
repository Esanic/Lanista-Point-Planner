import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BuildService } from '../../../../../support/services/build.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IWeapon } from '../../../../../support/interfaces/_armory/weapon';
import { GlobalService } from '../../../../../support/services/global.service';
import { ArmoryService } from '../../../../../support/services/armory.service';
import { weaponSkillStr } from '../../../../../support/enums/weapon-skills.enums';
import { ITotalBonus } from '../../../../../support/interfaces/_armory/bonus';
import { additiveBonus, multiplierBonus } from '../../../../../support/constants/bonuses';

@Component({
  selector: 'app-select-mainhand',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-mainhand.component.html',
  styleUrl: './select-mainhand.component.css',
})
export class SelectMainhandComponent implements OnInit, OnDestroy {
  public chosenMainhand = new FormControl('');

  private viewLegendEquipment: boolean = false;
  private selectedWeaponSkill: string = '';
  private currentMaxLevel: number = 25;

  public weaponArray: BehaviorSubject<IWeapon[]> = new BehaviorSubject<IWeapon[]>([]);

  private chosenWeaponSkill$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();
  private tableStats$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private globalService: GlobalService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      this.selectedWeaponSkill = weaponSkill.split(' ')[0];
      this.chosenMainhand.patchValue('');
      this.selectWeaponArray(this.selectedWeaponSkill);
    });

    this.viewLegendEquipment$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((legendEquipmentViewStatus) => {
      this.viewLegendEquipment = legendEquipmentViewStatus;
      this.selectWeaponArray(this.selectedWeaponSkill);
    });

    this.tableStats$ = this.buildService.getStatsFromTable().subscribe((stats) => {
      if (stats.levels) {
        this.currentMaxLevel = stats.levels.length;
        this.selectWeaponArray(this.selectedWeaponSkill);
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenMainhand.patchValue('');
    });

    this.chosenMainhand.valueChanges.subscribe((mainhand) => {
      const chosenWeapon = this.weaponArray.value.find((weapon) => weapon.name === mainhand);

      if (chosenWeapon) {
        const bonusToAdd: ITotalBonus = this.armoryService.calculateBonusesFromEquipment(chosenWeapon, this.selectedWeaponSkill);

        this.armoryService.addBonus('mainhand', bonusToAdd);
        this.armoryService.emitBonusesHaveBeenAdded({});
      } else {
        this.resetBonus();
      }
    });
  }

  ngOnDestroy(): void {
    this.chosenWeaponSkill$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
    this.tableStats$.unsubscribe();
    this.wipeBonus$.unsubscribe();
  }

  private resetBonus(): void {
    this.armoryService.addBonus('mainhand', {
      additiveBonus: additiveBonus,
      multiplierBonus: multiplierBonus,
    });
    this.armoryService.emitBonusesHaveBeenAdded({});
  }

  private selectWeaponArray(weaponSkill: string): void {
    switch (weaponSkill) {
      case weaponSkillStr.Axe: {
        this.weaponArray.next(this.armoryService.filterAndRenameEquipment(this.globalService.axe, this.currentMaxLevel));
        break;
      }
      case weaponSkillStr.Sword: {
        this.weaponArray.next(this.armoryService.filterAndRenameEquipment(this.globalService.sword, this.currentMaxLevel));
        break;
      }
      case weaponSkillStr.Mace: {
        this.weaponArray.next(this.armoryService.filterAndRenameEquipment(this.globalService.mace, this.currentMaxLevel));
        break;
      }
      case weaponSkillStr.Stave: {
        this.weaponArray.next(this.armoryService.filterAndRenameEquipment(this.globalService.stave, this.currentMaxLevel));
        break;
      }
      case weaponSkillStr.Spear: {
        this.weaponArray.next(this.armoryService.filterAndRenameEquipment(this.globalService.spear, this.currentMaxLevel));
        break;
      }
      case weaponSkillStr.Chain: {
        this.weaponArray.next(this.armoryService.filterAndRenameEquipment(this.globalService.chain, this.currentMaxLevel));
        break;
      }
    }
  }
}

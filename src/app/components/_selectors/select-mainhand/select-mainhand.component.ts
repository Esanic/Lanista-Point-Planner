import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuildService } from '../../../support/services/build.service';
import { Subscription } from 'rxjs';
import { IWeapon } from '../../../support/interfaces/weapon';
import { GlobalService } from '../../../support/services/global.service';
import { ArmoryService } from '../../../support/services/armory.service';
import { weaponSkillStr } from '../../../support/enums/weapon-skills.enums';
import { main } from '@popperjs/core';
import { IBonus } from '../../../support/interfaces/bonus';

@Component({
  selector: 'app-select-mainhand',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './select-mainhand.component.html',
  styleUrl: './select-mainhand.component.css',
})
export class SelectMainhandComponent implements OnInit, OnDestroy {
  public chosenMainhand = new FormControl('');

  private viewLegendEquipment: boolean = false;
  private selectedWeaponSkill: string = '';
  private currentMaxLevel: number = 25;

  public weaponArray: IWeapon[] = [];

  private chosenWeaponSkill$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();
  private tableStats$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private globalService: GlobalService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      this.selectedWeaponSkill = weaponSkill.split(' ')[0];
      this.selectWeaponArray(this.selectedWeaponSkill);
    });

    this.viewLegendEquipment$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((legendEquipmentViewStatus) => {
      this.viewLegendEquipment = legendEquipmentViewStatus;
      this.selectWeaponArray(this.selectedWeaponSkill);
    });

    this.tableStats$ = this.buildService.getStatsFromTable().subscribe((stats) => {
      this.currentMaxLevel = stats.levels.length;
      this.selectWeaponArray(this.selectedWeaponSkill);
    });

    this.chosenMainhand.valueChanges.subscribe((mainhand) => {
      const chosenWeapon = this.weaponArray.find((weapon) => weapon.name === mainhand);

      const bonusToAdd: IBonus[] = chosenWeapon ? this.armoryService.calculateBonusesFromEquipment(chosenWeapon, this.selectedWeaponSkill) : ([{}, {}] as IBonus[]);

      this.armoryService.addBonus('mainhand', bonusToAdd);
      this.armoryService.emitBonusesHaveBeenAdded({});
    });
  }

  ngOnDestroy(): void {
    this.chosenWeaponSkill$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
    this.tableStats$.unsubscribe();
  }

  private selectWeaponArray(weaponSkill: string): void {
    this.weaponArray = [];

    switch (weaponSkill) {
      case weaponSkillStr.Axe: {
        this.weaponArray = this.filterAndRenamedWeapons(this.globalService.axe);
        break;
      }
      case weaponSkillStr.Sword: {
        this.weaponArray = this.filterAndRenamedWeapons(this.globalService.sword);
        break;
      }
      case weaponSkillStr.Mace: {
        this.weaponArray = this.filterAndRenamedWeapons(this.globalService.mace);
        break;
      }
      case weaponSkillStr.Stave: {
        this.weaponArray = this.filterAndRenamedWeapons(this.globalService.stave);
        break;
      }
      case weaponSkillStr.Spear: {
        this.weaponArray = this.filterAndRenamedWeapons(this.globalService.spear);
        break;
      }
      case weaponSkillStr.Chain: {
        this.weaponArray = this.filterAndRenamedWeapons(this.globalService.chain);
        break;
      }
    }
  }

  private filterAndRenamedWeapons(weaponArray: IWeapon[]): IWeapon[] {
    const weapons = JSON.parse(JSON.stringify(weaponArray));

    let filteredWeapons: IWeapon[] = [];
    if (this.viewLegendEquipment) {
      filteredWeapons = weapons.filter((weapon: IWeapon) => weapon.max_level <= this.currentMaxLevel && weapon.required_level <= this.currentMaxLevel);
    } else {
      filteredWeapons = weapons.filter((weapon: IWeapon) => !weapon.requires_legend && weapon.max_level <= this.currentMaxLevel && weapon.required_level <= this.currentMaxLevel);
    }

    const renamedWeapons: IWeapon[] = filteredWeapons.map((weapon) => {
      weapon.name = `${weapon.name} (G${weapon.required_level}${weapon.max_level ? '-' + weapon.max_level : ''}) ${weapon.requires_legend ? '(L)' : ''}`;
      return weapon;
    });

    const sortedWeapons = renamedWeapons.sort((a, b) => a.required_level - b.required_level);

    return sortedWeapons;
  }
}

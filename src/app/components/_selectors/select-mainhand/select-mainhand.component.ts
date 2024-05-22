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
      let bonusToAdd: IBonus = {
        stamina: 0,
        strength: 0,
        endurance: 0,
        initiative: 0,
        dodge: 0,
        learningCapacity: 0,
        luck: 0,
        discipline: 0,
        weaponSkill: 0,
        shield: 0,
      } as IBonus;

      chosenWeapon!.bonuses.forEach((bonus) => {
        if (
          bonus.type.toLowerCase() === 'axe' ||
          bonus.type.toLowerCase() === 'sword' ||
          bonus.type.toLowerCase() === 'mace' ||
          bonus.type.toLowerCase() === 'stave' ||
          bonus.type.toLowerCase() === 'spear' ||
          bonus.type.toLowerCase() === 'chain'
        ) {
          if (bonus.type.toLowerCase() === 'axe' && this.selectedWeaponSkill === weaponSkillStr.Axe) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'sword' && this.selectedWeaponSkill === weaponSkillStr.Sword) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'mace' && this.selectedWeaponSkill === weaponSkillStr.Mace) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'stave' && this.selectedWeaponSkill === weaponSkillStr.Stave) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'spear' && this.selectedWeaponSkill === weaponSkillStr.Spear) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
          if (bonus.type.toLowerCase() === 'chain' && this.selectedWeaponSkill === weaponSkillStr.Chain) {
            bonusToAdd.weaponSkill += bonus.additive;
          }
        }

        switch (bonus.type.toLowerCase()) {
          case 'stamina': {
            bonusToAdd.stamina += bonus.additive;
            break;
          }
          case 'strength': {
            bonusToAdd.strength += bonus.additive;
            break;
          }
          case 'endurance': {
            bonusToAdd.endurance += bonus.additive;
            break;
          }
          case 'initiative': {
            bonusToAdd.initiative += bonus.additive;
            break;
          }
          case 'dodge': {
            bonusToAdd.dodge += bonus.additive;
            break;
          }
          case 'learningcapacity': {
            bonusToAdd.learningCapacity += bonus.additive;
            break;
          }
          case 'luck': {
            bonusToAdd.luck += bonus.additive;
            break;
          }
          case 'discipline': {
            bonusToAdd.discipline += bonus.additive;
            break;
          }
          case 'shield': {
            bonusToAdd.shield += bonus.additive;
            break;
          }
          default: {
            break;
          }
        }
      });
      this.armoryService.addBonus(bonusToAdd);
      console.log(1);
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

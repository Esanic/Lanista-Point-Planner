import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { weaponSkillStr } from '../../../../support/enums/weapon-skills.enums';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { IWeapon } from '../../../../support/interfaces/_armory/weapon';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { GlobalService } from '../../../../support/services/global.service';
import { additiveBonus, multiplierBonus } from '../../../../support/constants/bonuses';

@Component({
  selector: 'app-select-offhand',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-offhand.component.html',
  styleUrl: './select-offhand.component.css',
})
export class SelectOffhandComponent {
  public chosenOffhand = new FormControl('');

  private viewLegendEquipment: boolean = false;
  private selectedWeaponSkill: string = '';
  private shieldBuild: boolean = false;
  private currentMaxLevel: number = 25;

  public weaponArray: BehaviorSubject<IWeapon[]> = new BehaviorSubject<IWeapon[]>([]);

  private chosenWeaponSkill$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();
  private tableStats$: Subscription = new Subscription();
  private shieldBuild$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private globalService: GlobalService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      this.selectedWeaponSkill = weaponSkill.split(' ')[0];
      this.chosenOffhand.patchValue('');
      this.selectWeaponArray(this.selectedWeaponSkill);
    });

    this.shieldBuild$ = this.armoryService.listenShieldBuild().subscribe((shieldBuild) => {
      this.chosenOffhand.patchValue('');
      this.shieldBuild = shieldBuild;
      this.selectOffhand();
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

    this.chosenOffhand.valueChanges.subscribe((offhand) => {
      const chosenWeapon = this.weaponArray.value.find((weapon) => weapon.name === offhand);

      if (chosenWeapon) {
        const bonusToAdd: ITotalBonus = this.armoryService.calculateBonusesFromEquipment(chosenWeapon, this.selectedWeaponSkill);

        this.armoryService.addBonus('offhand', bonusToAdd);
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
    this.shieldBuild$.unsubscribe();
  }

  //* If shieldBuild is true, then shield is selected, otherwise the selectedWeaponSkill is selected
  private selectOffhand(): void {
    if (this.shieldBuild) {
      this.selectWeaponArray(weaponSkillStr.Shield);
    } else {
      this.selectWeaponArray(this.selectedWeaponSkill);
    }
  }

  private resetBonus(): void {
    this.armoryService.addBonus('offhand', {
      additiveBonus: additiveBonus,
      multiplierBonus: multiplierBonus,
    });
    this.armoryService.emitBonusesHaveBeenAdded({});
  }

  private selectWeaponArray(weaponSkill: string): void {
    switch (weaponSkill) {
      case weaponSkillStr.Axe: {
        this.weaponArray.next(this.filterAndRenamedWeapons(this.globalService.axe));
        break;
      }
      case weaponSkillStr.Sword: {
        this.weaponArray.next(this.filterAndRenamedWeapons(this.globalService.sword));
        break;
      }
      case weaponSkillStr.Mace: {
        this.weaponArray.next(this.filterAndRenamedWeapons(this.globalService.mace));
        break;
      }
      case weaponSkillStr.Stave: {
        this.weaponArray.next(this.filterAndRenamedWeapons(this.globalService.stave));
        break;
      }
      case weaponSkillStr.Spear: {
        this.weaponArray.next(this.filterAndRenamedWeapons(this.globalService.spear));
        break;
      }
      case weaponSkillStr.Chain: {
        this.weaponArray.next(this.filterAndRenamedWeapons(this.globalService.chain));
        break;
      }
      case weaponSkillStr.Shield: {
        this.weaponArray.next(this.filterAndRenamedWeapons(this.globalService.shield));
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

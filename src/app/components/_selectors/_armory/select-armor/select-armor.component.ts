import { Component, Input, OnInit } from '@angular/core';
import { BuildService } from '../../../../support/services/build.service';
import { ArmoryService } from '../../../../support/services/armory.service';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IArmor } from '../../../../support/interfaces/_armory/armor';
import { GlobalService } from '../../../../support/services/global.service';
import { armorSlots } from '../../../../support/enums/armor.enums';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { ArmorPipe } from '../../../../support/pipes/armor.pipe';
import { additiveBonus, multiplierBonus } from '../../../../support/constants/bonuses';
import { emptyString } from '../../../../support/constants/global';

@Component({
  selector: 'app-select-armor',
  standalone: true,
  templateUrl: './select-armor.component.html',
  styleUrl: './select-armor.component.css',
  imports: [ReactiveFormsModule, ArmorPipe],
})
export class SelectArmorComponent implements OnInit {
  @Input() armorSlot: number = -1;

  public chosenArmor = new FormControl(emptyString);

  public filteredAndRenamedArmorArray: IArmor[] = [];

  private currentMaxLevel: number = 25;
  private viewLegendEquipment: boolean = false;

  private armorsFetched$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();
  private tableStats$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService, private globalService: GlobalService) {}

  ngOnInit(): void {
    this.armorsFetched$ = this.armoryService.listenArmorsAndAccessoriesFetched().subscribe((event) => {
      if (event) {
        this.filterAndRenameArmors();
      }
    });

    this.viewLegendEquipment$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((legendEquipmentViewStatus) => {
      this.viewLegendEquipment = legendEquipmentViewStatus;
      this.filterAndRenameArmors();
    });

    this.tableStats$ = this.buildService.getStatsFromTable().subscribe((stats) => {
      if (stats.levels) {
        this.currentMaxLevel = stats.levels.length;
        this.filterAndRenameArmors();
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenArmor.patchValue(emptyString);
    });

    this.chosenArmor.valueChanges.subscribe((armor) => {
      const chosenArmor = this.filteredAndRenamedArmorArray.find((armorToLookAt) => armorToLookAt.name === armor);

      if (chosenArmor) {
        const bonusesToAdd: ITotalBonus = this.armoryService.calculateBonusesFromEquipment(chosenArmor);

        switch (this.armorSlot) {
          case armorSlots.Head:
            this.armoryService.addBonus('head', bonusesToAdd);
            break;
          case armorSlots.Shoulders:
            this.armoryService.addBonus('shoulders', bonusesToAdd);
            break;
          case armorSlots.Chest:
            this.armoryService.addBonus('chest', bonusesToAdd);
            break;
          case armorSlots.Hands:
            this.armoryService.addBonus('gloves', bonusesToAdd);
            break;
          case armorSlots.Legs:
            this.armoryService.addBonus('legs', bonusesToAdd);
            break;
          case armorSlots.Feet:
            this.armoryService.addBonus('boots', bonusesToAdd);
            break;
        }
      } else {
        this.resetBonus();
      }
      this.armoryService.emitBonusesHaveBeenAdded();
    });
  }

  ngOnDestroy(): void {
    this.armorsFetched$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
    this.tableStats$.unsubscribe();
    this.wipeBonus$.unsubscribe();
  }

  private resetBonus(): void {
    switch (this.armorSlot) {
      case armorSlots.Head:
        this.armoryService.addBonus('head', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case armorSlots.Shoulders:
        this.armoryService.addBonus('shoulders', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case armorSlots.Chest:
        this.armoryService.addBonus('chest', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case armorSlots.Hands:
        this.armoryService.addBonus('gloves', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case armorSlots.Legs:
        this.armoryService.addBonus('legs', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case armorSlots.Feet:
        this.armoryService.addBonus('boots', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
    }
  }

  private filterAndRenameArmors(): void {
    switch (this.armorSlot) {
      case armorSlots.Head:
        this.filteredAndRenamedArmorArray = this.armoryService.filterAndRenameEquipment(this.globalService.head, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Shoulders:
        this.filteredAndRenamedArmorArray = this.armoryService.filterAndRenameEquipment(this.globalService.shoulders, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Chest:
        this.filteredAndRenamedArmorArray = this.armoryService.filterAndRenameEquipment(this.globalService.chest, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Hands:
        this.filteredAndRenamedArmorArray = this.armoryService.filterAndRenameEquipment(this.globalService.gloves, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Legs:
        this.filteredAndRenamedArmorArray = this.armoryService.filterAndRenameEquipment(this.globalService.legs, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Feet:
        this.filteredAndRenamedArmorArray = this.armoryService.filterAndRenameEquipment(this.globalService.boots, this.currentMaxLevel, this.viewLegendEquipment);
        break;
    }
  }
}

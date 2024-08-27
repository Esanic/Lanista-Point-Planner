import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { additiveBonus, multiplierBonus } from '../../../../support/constants/bonuses';
import { emptyString } from '../../../../support/constants/global';
import { accessoriesSlots } from '../../../../support/enums/accessories.enums';
import { IArmor } from '../../../../support/interfaces/_armory/armor';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { GlobalService } from '../../../../support/services/global.service';
import { AccessoriesPipe } from '../../../../support/pipes/accessories.pipe';
import { IAccessory } from '../../../../support/interfaces/_armory/accessory';

@Component({
  selector: 'app-select-accessory',
  standalone: true,
  imports: [ReactiveFormsModule, AccessoriesPipe],
  templateUrl: './select-accessory.component.html',
  styleUrl: './select-accessory.component.css',
})
export class SelectAccessoryComponent implements OnInit, OnDestroy {
  @Input() accessorySlot: number = -1;

  public chosenAccessory = new FormControl(emptyString);

  public filteredAndRenamedAccessoriesArray: IAccessory[] = [];

  private currentMaxLevel: number = 25;
  private viewLegendEquipment: boolean = false;

  private accessoriesFetched$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();
  private tableStats$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService, private globalService: GlobalService) {}

  ngOnInit(): void {
    this.accessoriesFetched$ = this.armoryService.listenArmorsAndAccessoriesFetched().subscribe((event) => {
      if (event) {
        this.selectAccessorySlotToFilterAndRename();
      }
    });

    this.viewLegendEquipment$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((legendEquipmentViewStatus) => {
      this.viewLegendEquipment = legendEquipmentViewStatus;
      this.selectAccessorySlotToFilterAndRename();
    });

    this.tableStats$ = this.buildService.getStatsFromTable().subscribe((stats) => {
      if (stats.levels) {
        this.currentMaxLevel = stats.levels.length;
        this.selectAccessorySlotToFilterAndRename();
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenAccessory.patchValue(emptyString);
    });

    this.chosenAccessory.valueChanges.subscribe((armor) => {
      const chosenAccessory = this.filteredAndRenamedAccessoriesArray.find((accesoryToLookAt) => accesoryToLookAt.name === armor);

      if (chosenAccessory) {
        const bonusesToAdd: ITotalBonus = this.armoryService.calculateBonusesFromEquipment(chosenAccessory);

        switch (this.accessorySlot) {
          case accessoriesSlots.Back:
            this.armoryService.addBonus('back', bonusesToAdd);
            break;
          case accessoriesSlots.Neck:
            this.armoryService.addBonus('neck', bonusesToAdd);
            break;
          case accessoriesSlots.Finger:
            this.armoryService.addBonus('finger', bonusesToAdd);
            break;
          case accessoriesSlots.Amulet:
            this.armoryService.addBonus('amulet', bonusesToAdd);
            break;
          case accessoriesSlots.Bracelet:
            this.armoryService.addBonus('bracelet', bonusesToAdd);
            break;
          case accessoriesSlots.Trinket:
            this.armoryService.addBonus('trinket', bonusesToAdd);
            break;
        }
      } else {
        this.resetBonus();
      }
      this.armoryService.emitBonusesHaveBeenAdded();
    });
  }

  ngOnDestroy(): void {
    this.accessoriesFetched$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
    this.tableStats$.unsubscribe();
    this.wipeBonus$.unsubscribe();
  }

  private resetBonus(): void {
    switch (this.accessorySlot) {
      case accessoriesSlots.Back:
        this.armoryService.addBonus('back', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case accessoriesSlots.Neck:
        this.armoryService.addBonus('neck', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case accessoriesSlots.Finger:
        this.armoryService.addBonus('finger', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case accessoriesSlots.Amulet:
        this.armoryService.addBonus('amulet', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case accessoriesSlots.Bracelet:
        this.armoryService.addBonus('bracelet', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case accessoriesSlots.Trinket:
        this.armoryService.addBonus('trinket', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
    }
  }

  private selectAccessorySlotToFilterAndRename(): void {
    switch (this.accessorySlot) {
      case accessoriesSlots.Back:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.globalService.back, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Neck:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.globalService.neck, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Finger:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.globalService.finger, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Amulet:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.globalService.amulet, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Bracelet:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.globalService.bracelet, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Trinket:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.globalService.trinket, this.currentMaxLevel, this.viewLegendEquipment);
        break;
    }
  }

  private filterAndRenameAccessory(equipmentArray: IAccessory[], currentMaxLevel: number, showLegendEquipment: boolean): IAccessory[] {
    const equipment = JSON.parse(JSON.stringify(equipmentArray));

    let filteredEquipment: IAccessory[] = [];

    if (showLegendEquipment) {
      filteredEquipment = equipment.filter((equipment: IAccessory) => equipment.required_level <= currentMaxLevel);
    } else {
      filteredEquipment = equipment.filter((equipment: IAccessory) => !equipment.requires_legend && equipment.required_level <= currentMaxLevel);
    }

    const renamedEquipment: IAccessory[] = filteredEquipment.map((equipment) => {
      equipment.name = `${equipment.name} (G${equipment.required_level}${equipment.max_level ? '-' + equipment.max_level : emptyString}) ${equipment.requires_legend ? '(L)' : emptyString}`;
      return equipment;
    });

    const sortedEquipment = renamedEquipment.sort((a, b) => a.required_level - b.required_level);

    return sortedEquipment;
  }
}

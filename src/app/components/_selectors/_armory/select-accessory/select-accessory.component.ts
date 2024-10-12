import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { accessoryTemplate, additiveBonus, multiplierBonus } from '../../../../support/constants/templates';
import { emptyString } from '../../../../support/constants/common';
import { accessoriesSlots } from '../../../../support/enums/accessories.enums';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { AccessoriesPipe } from '../../../../support/pipes/accessories.pipe';
import { IAccessory } from '../../../../support/interfaces/_armory/accessory';
import { calculateBonusesFromEquipment } from '../../../../support/helpers/armory.helper';
import { deepCopy } from '../../../../support/helpers/common.helper';

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
  private maxLevel$: Subscription = new Subscription();
  private chosenAccessory$: Subscription = new Subscription();
  private incomingAccessory$: Subscription = new Subscription();
  private importedAccessory$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService) {}

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

    this.maxLevel$ = this.buildService.getAmountOfLevels().subscribe((levels) => {
      if (levels) {
        this.currentMaxLevel = levels;
        this.selectAccessorySlotToFilterAndRename();
      }
    });

    this.chosenAccessory$ = this.chosenAccessory.valueChanges.subscribe((accessory) => {
      if (accessory === emptyString) return;

      const chosenAccessory = this.filteredAndRenamedAccessoriesArray.find((accesoryToLookAt) => accesoryToLookAt.name === accessory);

      if (chosenAccessory) {
        const bonusesToAdd: ITotalBonus = calculateBonusesFromEquipment(chosenAccessory);

        switch (this.accessorySlot) {
          case accessoriesSlots.Cloak:
            this.armoryService.addBonus('back', bonusesToAdd);
            this.armoryService.setGear('cloak', chosenAccessory);
            break;
          case accessoriesSlots.Necklace:
            this.armoryService.addBonus('neck', bonusesToAdd);
            this.armoryService.setGear('necklace', chosenAccessory);
            break;
          case accessoriesSlots.Ring:
            this.armoryService.addBonus('finger', bonusesToAdd);
            this.armoryService.setGear('ring', chosenAccessory);
            break;
          case accessoriesSlots.Amulet:
            this.armoryService.addBonus('amulet', bonusesToAdd);
            this.armoryService.setGear('amulet', chosenAccessory);
            break;
          case accessoriesSlots.Bracelet:
            this.armoryService.addBonus('bracelet', bonusesToAdd);
            this.armoryService.setGear('bracelet', chosenAccessory);
            break;
          case accessoriesSlots.Trinket:
            this.armoryService.addBonus('trinket', bonusesToAdd);
            this.armoryService.setGear('trinket', chosenAccessory);
            break;
        }
      } else {
        this.resetBonus();
      }
      this.armoryService.emitBonusesHaveBeenAdded();
    });

    this.incomingAccessory$ = this.armoryService.getGear().subscribe((gear) => {
      switch (this.accessorySlot) {
        case accessoriesSlots.Cloak:
          const back = this.filteredAndRenamedAccessoriesArray.find((accessory) => accessory.name === gear.cloak.name);
          if (back) this.chosenAccessory.patchValue(back.name, { emitEvent: false });
          break;
        case accessoriesSlots.Necklace:
          const neck = this.filteredAndRenamedAccessoriesArray.find((accessory) => accessory.name === gear.necklace.name);
          if (neck) this.chosenAccessory.patchValue(neck.name, { emitEvent: false });
          break;
        case accessoriesSlots.Ring:
          const finger = this.filteredAndRenamedAccessoriesArray.find((accessory) => accessory.name === gear.ring.name);
          if (finger) this.chosenAccessory.patchValue(finger.name, { emitEvent: false });
          break;
        case accessoriesSlots.Amulet:
          const amulet = this.filteredAndRenamedAccessoriesArray.find((accessory) => accessory.name === gear.amulet.name);
          if (amulet) this.chosenAccessory.patchValue(amulet.name, { emitEvent: false });
          break;
        case accessoriesSlots.Bracelet:
          const bracelet = this.filteredAndRenamedAccessoriesArray.find((accessory) => accessory.name === gear.bracelet.name);
          if (bracelet) this.chosenAccessory.patchValue(bracelet.name, { emitEvent: false });
          break;
        case accessoriesSlots.Trinket:
          const trinket = this.filteredAndRenamedAccessoriesArray.find((accessory) => accessory.name === gear.trinket.name);
          if (trinket) this.chosenAccessory.patchValue(trinket.name, { emitEvent: false });
          break;
      }
    });

    this.importedAccessory$ = this.armoryService.getImportedGear().subscribe((gear) => {
      switch (this.accessorySlot) {
        case accessoriesSlots.Cloak:
          this.handleImportedAccessory(gear.cloak, 'cloak');
          break;
        case accessoriesSlots.Necklace:
          this.handleImportedAccessory(gear.necklace, 'necklace');
          break;
        case accessoriesSlots.Ring:
          this.handleImportedAccessory(gear.ring, 'ring');
          break;
        case accessoriesSlots.Amulet:
          this.handleImportedAccessory(gear.amulet, 'amulet');
          break;
        case accessoriesSlots.Bracelet:
          this.handleImportedAccessory(gear.bracelet, 'bracelet');
          break;
        case accessoriesSlots.Trinket:
          this.handleImportedAccessory(gear.trinket, 'trinket');
          break;
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenAccessory.patchValue(emptyString);
    });
  }

  ngOnDestroy(): void {
    this.accessoriesFetched$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
    this.maxLevel$.unsubscribe();
    this.chosenAccessory$.unsubscribe();
    this.incomingAccessory$.unsubscribe();
    this.importedAccessory$.unsubscribe();
    this.wipeBonus$.unsubscribe();
  }

  private resetBonus(): void {
    switch (this.accessorySlot) {
      case accessoriesSlots.Cloak:
        this.armoryService.addBonus('back', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case accessoriesSlots.Necklace:
        this.armoryService.addBonus('neck', {
          additiveBonus: additiveBonus,
          multiplierBonus: multiplierBonus,
        });
        break;
      case accessoriesSlots.Ring:
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
      case accessoriesSlots.Cloak:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.armoryService.back, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Necklace:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.armoryService.neck, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Ring:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.armoryService.finger, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Amulet:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.armoryService.amulet, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Bracelet:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.armoryService.bracelet, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case accessoriesSlots.Trinket:
        this.filteredAndRenamedAccessoriesArray = this.filterAndRenameAccessory(this.armoryService.trinket, this.currentMaxLevel, this.viewLegendEquipment);
        break;
    }
  }

  private filterAndRenameAccessory(equipmentArray: IAccessory[], currentMaxLevel: number, showLegendEquipment: boolean): IAccessory[] {
    const equipment = deepCopy(equipmentArray);

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

  /** Helper function to handle the imported accessory
   *
   * @param accessoryName - The name of the accessory to find in the array
   * @param gearSlot - The gear slot to set the accessory to
   */
  private handleImportedAccessory(accessoryName: string, gearSlot: string): void {
    const accessory = this.filteredAndRenamedAccessoriesArray.find((accessory) => accessory.name.split('(')[0].trimEnd() === accessoryName);

    if (accessory) {
      this.chosenAccessory.patchValue(accessory.name);
      this.armoryService.setGear(gearSlot, accessory);
    } else {
      this.chosenAccessory.patchValue(emptyString);
      this.armoryService.setGear(gearSlot, accessoryTemplate);
    }
  }
}

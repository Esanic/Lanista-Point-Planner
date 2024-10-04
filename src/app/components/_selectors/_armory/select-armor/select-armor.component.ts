import { Component, Input, OnInit } from '@angular/core';
import { BuildService } from '../../../../support/services/build.service';
import { ArmoryService } from '../../../../support/services/armory.service';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IArmor } from '../../../../support/interfaces/_armory/armor';
import { armorSlots } from '../../../../support/enums/armor.enums';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { ArmorPipe } from '../../../../support/pipes/armor.pipe';
import { additiveBonus, multiplierBonus } from '../../../../support/constants/templates';
import { emptyString } from '../../../../support/constants/common';
import { calculateBonusesFromEquipment } from '../../../../support/helpers/armory.helper';

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
  private chosenArmor$: Subscription = new Subscription();
  private incomingArmor$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.armorsFetched$ = this.armoryService.listenArmorsAndAccessoriesFetched().subscribe((event) => {
      if (event) {
        this.selectArmorSlotToFilterAndRename();
      }
    });

    this.viewLegendEquipment$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((legendEquipmentViewStatus) => {
      this.viewLegendEquipment = legendEquipmentViewStatus;
      this.selectArmorSlotToFilterAndRename();
    });

    this.tableStats$ = this.buildService.getStatsFromTable().subscribe((stats) => {
      if (stats.levels) {
        this.currentMaxLevel = stats.levels.length;
        this.selectArmorSlotToFilterAndRename();
      }
    });

    this.chosenArmor$ = this.chosenArmor.valueChanges.subscribe((armor) => {
      const chosenArmor = this.filteredAndRenamedArmorArray.find((armorToLookAt) => armorToLookAt.name === armor);

      if (chosenArmor) {
        const bonusesToAdd: ITotalBonus = calculateBonusesFromEquipment(chosenArmor);

        switch (this.armorSlot) {
          case armorSlots.Head:
            this.armoryService.addBonus('head', bonusesToAdd);
            this.armoryService.setGear('head', chosenArmor);
            break;
          case armorSlots.Shoulders:
            this.armoryService.addBonus('shoulders', bonusesToAdd);
            this.armoryService.setGear('shoulders', chosenArmor);
            break;
          case armorSlots.Chest:
            this.armoryService.addBonus('chest', bonusesToAdd);
            this.armoryService.setGear('chest', chosenArmor);
            break;
          case armorSlots.Hands:
            this.armoryService.addBonus('gloves', bonusesToAdd);
            this.armoryService.setGear('gloves', chosenArmor);
            break;
          case armorSlots.Legs:
            this.armoryService.addBonus('legs', bonusesToAdd);
            this.armoryService.setGear('legs', chosenArmor);
            break;
          case armorSlots.Feet:
            this.armoryService.addBonus('boots', bonusesToAdd);
            this.armoryService.setGear('boots', chosenArmor);
            break;
        }
      } else {
        this.resetBonus();
      }
      this.armoryService.emitBonusesHaveBeenAdded();
    });

    this.incomingArmor$ = this.armoryService.getGear().subscribe((gear) => {
      switch (this.armorSlot) {
        case armorSlots.Head:
          const head = this.filteredAndRenamedArmorArray.find((armor) => armor.name === gear.head.name);
          if (head) this.chosenArmor.patchValue(head.name, { emitEvent: false });
          break;
        case armorSlots.Shoulders:
          const shoulders = this.filteredAndRenamedArmorArray.find((armor) => armor.name === gear.shoulders.name);
          if (shoulders) this.chosenArmor.patchValue(shoulders.name, { emitEvent: false });
          break;
        case armorSlots.Chest:
          const chest = this.filteredAndRenamedArmorArray.find((armor) => armor.name === gear.chest.name);
          if (chest) this.chosenArmor.patchValue(chest.name, { emitEvent: false });
          break;
        case armorSlots.Hands:
          const gloves = this.filteredAndRenamedArmorArray.find((armor) => armor.name === gear.gloves.name);
          if (gloves) this.chosenArmor.patchValue(gloves.name, { emitEvent: false });
          break;
        case armorSlots.Legs:
          const legs = this.filteredAndRenamedArmorArray.find((armor) => armor.name === gear.legs.name);
          if (legs) this.chosenArmor.patchValue(legs.name, { emitEvent: false });
          break;
        case armorSlots.Feet:
          const boots = this.filteredAndRenamedArmorArray.find((armor) => armor.name === gear.boots.name);
          if (boots) this.chosenArmor.patchValue(boots.name, { emitEvent: false });
          break;
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenArmor.patchValue(emptyString);
    });
  }

  ngOnDestroy(): void {
    this.armorsFetched$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
    this.tableStats$.unsubscribe();
    this.chosenArmor$.unsubscribe();
    this.incomingArmor$.unsubscribe();
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

  private selectArmorSlotToFilterAndRename(): void {
    switch (this.armorSlot) {
      case armorSlots.Head:
        this.filteredAndRenamedArmorArray = this.filterAndRenameArmor(this.armoryService.head, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Shoulders:
        this.filteredAndRenamedArmorArray = this.filterAndRenameArmor(this.armoryService.shoulders, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Chest:
        this.filteredAndRenamedArmorArray = this.filterAndRenameArmor(this.armoryService.chest, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Hands:
        this.filteredAndRenamedArmorArray = this.filterAndRenameArmor(this.armoryService.gloves, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Legs:
        this.filteredAndRenamedArmorArray = this.filterAndRenameArmor(this.armoryService.legs, this.currentMaxLevel, this.viewLegendEquipment);
        break;
      case armorSlots.Feet:
        this.filteredAndRenamedArmorArray = this.filterAndRenameArmor(this.armoryService.boots, this.currentMaxLevel, this.viewLegendEquipment);
        break;
    }
  }

  private filterAndRenameArmor(equipmentArray: IArmor[], currentMaxLevel: number, showLegendEquipment: boolean): IArmor[] {
    const equipment = JSON.parse(JSON.stringify(equipmentArray)); //TODO: Use helper function to deep copy

    let filteredEquipment: IArmor[] = [];

    if (showLegendEquipment) {
      filteredEquipment = equipment.filter((equipment: IArmor) => equipment.required_level <= currentMaxLevel);
    } else {
      filteredEquipment = equipment.filter((equipment: IArmor) => !equipment.requires_legend && equipment.required_level <= currentMaxLevel);
    }

    const renamedEquipment: IArmor[] = filteredEquipment.map((equipment) => {
      equipment.name = `${equipment.name} (G${equipment.required_level}${equipment.max_level ? '-' + equipment.max_level : emptyString}) ${equipment.requires_legend ? '(L)' : emptyString}`;
      return equipment;
    });

    const sortedEquipment = renamedEquipment.sort((a, b) => a.required_level - b.required_level);

    return sortedEquipment;
  }
}

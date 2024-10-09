import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { emptyString } from '../../../../support/constants/common';
import { Subscription } from 'rxjs';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { IConsumable } from '../../../../support/interfaces/_armory/consumables';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { ConsumablePipe } from '../../../../support/pipes/consumable.pipe';
import { calculateBonusesFromEquipment } from '../../../../support/helpers/armory.helper';
import { deepCopy } from '../../../../support/helpers/common.helper';
import { consumableTemplate } from '../../../../support/constants/templates';

@Component({
  selector: 'app-select-consumable',
  standalone: true,
  templateUrl: './select-consumable.component.html',
  styleUrl: './select-consumable.component.css',
  imports: [ReactiveFormsModule, ConsumablePipe],
})
export class SelectConsumableComponent implements OnInit, OnDestroy {
  @Input() consumableSlot: number = 0;

  public chosenConsumable = new FormControl(emptyString);

  public filteredAndRenamedConsumablesArray: IConsumable[] = [];

  private currentMaxLevel: number = 25;

  private consumablesFetched$: Subscription = new Subscription();
  private maxLevel$: Subscription = new Subscription();
  private chosenConsumable$: Subscription = new Subscription();
  private incomingConsumable$: Subscription = new Subscription();
  private importedConsumable$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private armoryService: ArmoryService, private buildService: BuildService) {}

  ngOnInit(): void {
    this.consumablesFetched$ = this.armoryService.listenConsumablesFetched().subscribe((event) => {
      if (event) {
        this.filterAndRenameConsumables();
      }
    });

    this.maxLevel$ = this.buildService.getAmountOfLevels().subscribe((levels) => {
      if (levels) {
        this.currentMaxLevel = levels;
        this.filterAndRenameConsumables();
      }
    });

    this.chosenConsumable$ = this.chosenConsumable.valueChanges.subscribe(() => {
      const chosenConsumable = this.filteredAndRenamedConsumablesArray.find((consumable) => consumable.name === this.chosenConsumable.value);

      if (chosenConsumable) {
        const bonusesToAdd: ITotalBonus = calculateBonusesFromEquipment(chosenConsumable);

        switch (this.consumableSlot) {
          case 1:
            this.armoryService.addBonus('consumableOne', bonusesToAdd);
            this.armoryService.setGear('consumableOne', chosenConsumable);
            break;
          case 2:
            this.armoryService.addBonus('consumableTwo', bonusesToAdd);
            this.armoryService.setGear('consumableTwo', chosenConsumable);
            break;
          case 3:
            this.armoryService.addBonus('consumableThree', bonusesToAdd);
            this.armoryService.setGear('consumableThree', chosenConsumable);
            break;
        }

        this.armoryService.emitBonusesHaveBeenAdded();
      }
    });

    this.incomingConsumable$ = this.armoryService.getGear().subscribe((gear) => {
      switch (this.consumableSlot) {
        case 1:
          const consumableOne = this.filteredAndRenamedConsumablesArray.find((consumable) => consumable.name === gear.consumableOne.name);
          if (consumableOne) this.chosenConsumable.patchValue(consumableOne.name, { emitEvent: false });
          break;
        case 2:
          const consumableTwo = this.filteredAndRenamedConsumablesArray.find((consumable) => consumable.name === gear.consumableTwo.name);
          if (consumableTwo) this.chosenConsumable.patchValue(consumableTwo.name, { emitEvent: false });
          break;
        case 3:
          const consumableThree = this.filteredAndRenamedConsumablesArray.find((consumable) => consumable.name === gear.consumableThree.name);
          if (consumableThree) this.chosenConsumable.patchValue(consumableThree.name, { emitEvent: false });
          break;
      }
    });

    this.importedConsumable$ = this.armoryService.getImportedGear().subscribe((gear) => {
      switch (this.consumableSlot) {
        case 1:
          this.handleImportedConsumable(gear.consumableOne, 'consumableOne');
          break;
        case 2:
          this.handleImportedConsumable(gear.consumableTwo, 'consumableTwo');
          break;
        case 3:
          this.handleImportedConsumable(gear.consumableThree, 'consumableThree');
          break;
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenConsumable.patchValue(emptyString);
    });
  }

  ngOnDestroy(): void {
    this.consumablesFetched$.unsubscribe();
    this.maxLevel$.unsubscribe();
    this.chosenConsumable$.unsubscribe();
    this.incomingConsumable$.unsubscribe();
    this.importedConsumable$.unsubscribe();
    this.wipeBonus$.unsubscribe();
  }

  private filterAndRenameConsumables(): void {
    const equipment = deepCopy(this.armoryService.consumables);

    let filteredEquipment: IConsumable[] = [];

    filteredEquipment = equipment.filter((equipment: IConsumable) => equipment.required_level <= this.currentMaxLevel && equipment.for_live_battle === false && equipment.bonuses.length > 0);

    const renamedEquipment: IConsumable[] = filteredEquipment.map((equipment) => {
      equipment.name = `${equipment.name} (G${equipment.required_level}${equipment.max_level ? '-' + equipment.max_level : emptyString})`;
      return equipment;
    });

    const sortedEquipment = renamedEquipment.sort((a, b) => a.required_level - b.required_level);

    this.filteredAndRenamedConsumablesArray = sortedEquipment;
  }

  /** Helper function to handle the imported armor
   *
   * @param consumableName - The name of the armor to find in the array
   * @param gearSlot - The gear slot to set the armor to
   */
  private handleImportedConsumable(consumableName: string, gearSlot: string): void {
    const consumable = this.filteredAndRenamedConsumablesArray.find((accessory) => accessory.name.split('(')[0].trimEnd() === consumableName);

    if (consumable) {
      this.chosenConsumable.patchValue(consumable.name);
      this.armoryService.setGear(gearSlot, consumable);
    } else {
      this.chosenConsumable.patchValue(emptyString);
      this.armoryService.setGear(gearSlot, consumableTemplate);
    }
  }
}

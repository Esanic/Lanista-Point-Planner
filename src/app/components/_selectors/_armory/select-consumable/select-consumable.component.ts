import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { emptyString } from '../../../../support/constants/common';
import { Subscription } from 'rxjs';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { IConsumable } from '../../../../support/interfaces/_armory/consumables';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { ConsumablePipe } from '../../../../support/pipes/consumable.pipe';
import { ArmoryHelper } from '../../../../support/helpers/armory.helper';

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
  private tableStats$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();
  private incomingConsumable$: Subscription = new Subscription();

  constructor(private armoryService: ArmoryService, private armoryHelper: ArmoryHelper, private buildService: BuildService) {}

  ngOnInit(): void {
    this.consumablesFetched$ = this.armoryService.listenConsumablesFetched().subscribe((event) => {
      if (event) {
        this.filterAndRenameConsumables();
      }
    });

    this.tableStats$ = this.buildService.getStatsFromTable().subscribe((stats) => {
      if (stats.levels) {
        this.currentMaxLevel = stats.levels.length;
        this.filterAndRenameConsumables();
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenConsumable.patchValue(emptyString);
    });

    this.chosenConsumable.valueChanges.subscribe(() => {
      const chosenConsumable = this.filteredAndRenamedConsumablesArray.find((consumable) => consumable.name === this.chosenConsumable.value);

      if (chosenConsumable) {
        const bonusesToAdd: ITotalBonus = this.armoryHelper.calculateBonusesFromEquipment(chosenConsumable);

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
  }

  ngOnDestroy(): void {
    this.consumablesFetched$.unsubscribe();
    this.tableStats$.unsubscribe();
    this.wipeBonus$.unsubscribe();
    this.incomingConsumable$.unsubscribe();
  }

  private filterAndRenameConsumables(): void {
    const equipment = JSON.parse(JSON.stringify(this.armoryService.consumables));

    let filteredEquipment: IConsumable[] = [];

    filteredEquipment = equipment.filter((equipment: IConsumable) => equipment.required_level <= this.currentMaxLevel && equipment.for_live_battle === false && equipment.bonuses.length > 0);

    const renamedEquipment: IConsumable[] = filteredEquipment.map((equipment) => {
      equipment.name = `${equipment.name} (G${equipment.required_level}${equipment.max_level ? '-' + equipment.max_level : emptyString})`;
      return equipment;
    });

    const sortedEquipment = renamedEquipment.sort((a, b) => a.required_level - b.required_level);

    this.filteredAndRenamedConsumablesArray = sortedEquipment;
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { emptyString } from '../../../../support/constants/global';
import { Subscription } from 'rxjs';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { IConsumable } from '../../../../support/interfaces/_armory/consumables';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { GlobalService } from '../../../../support/services/global.service';
import { ConsumablePipe } from '../../../../support/pipes/consumable.pipe';

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

  constructor(private armoryService: ArmoryService, private buildService: BuildService, private globalService: GlobalService) {}

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

    this.chosenConsumable.valueChanges.subscribe((consumable) => {
      const chosenConsumable = this.filteredAndRenamedConsumablesArray.find((consumable) => consumable.name === this.chosenConsumable.value);

      if (chosenConsumable) {
        const bonusesToAdd: ITotalBonus = this.armoryService.calculateBonusesFromEquipment(chosenConsumable);

        switch (this.consumableSlot) {
          case 1:
            this.armoryService.addBonus('consumableOne', bonusesToAdd);
            break;
          case 2:
            this.armoryService.addBonus('consumableTwo', bonusesToAdd);
            break;
          case 3:
            this.armoryService.addBonus('consumableThree', bonusesToAdd);
            break;
          default:
            this.armoryService.addBonus('consumable', bonusesToAdd);
        }

        this.armoryService.emitBonusesHaveBeenAdded();
      }
    });
  }

  ngOnDestroy(): void {
    this.consumablesFetched$.unsubscribe();
    this.tableStats$.unsubscribe();
    this.wipeBonus$.unsubscribe();
  }

  private filterAndRenameConsumables(): void {
    const equipment = JSON.parse(JSON.stringify(this.globalService.consumables));

    let filteredEquipment: IConsumable[] = [];

    filteredEquipment = equipment.filter((equipment: IConsumable) => equipment.required_level <= this.currentMaxLevel && equipment.for_live_battle === false && equipment.bonuses.length > 0);

    const renamedEquipment: IConsumable[] = filteredEquipment.map((equipment) => {
      equipment.name = `${equipment.name} (G${equipment.required_level}${equipment.max_level ? '-' + equipment.max_level : emptyString}) ${equipment.requires_legend ? '(L)' : emptyString}`;
      return equipment;
    });

    const sortedEquipment = renamedEquipment.sort((a, b) => a.required_level - b.required_level);

    this.filteredAndRenamedConsumablesArray = sortedEquipment;
    console.log(sortedEquipment);
  }
}

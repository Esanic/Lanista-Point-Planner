import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BuildService } from '../../../support/services/build.service';
import { IRace } from '../../../support/interfaces/race';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AgePipe } from '../../../support/pipes/age.pipe';
import { additiveBonus, multiplierBonus } from '../../../support/constants/templates';
import { ArmoryService } from '../../../support/services/armory.service';

@Component({
  selector: 'select-age',
  standalone: true,
  imports: [ReactiveFormsModule, AgePipe],
  templateUrl: './select-age.component.html',
  styleUrl: './select-age.component.css',
})
export class SelectAgeComponent implements OnInit, OnDestroy {
  public chooseAge = new FormControl({ value: 'young', disabled: true });
  public ages: { name: string; age: number }[] = [];
  public selectedRace: IRace = {} as IRace;

  private selectedRace$: Subscription = new Subscription();
  private selectedAge$: Subscription = new Subscription();
  private importedAge$: Subscription = new Subscription();
  private wipe$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.selectedRace$ = this.buildService.getChosenRace().subscribe((race: IRace) => {
      if (!race || Object.keys(race).length === 0) {
        this.chooseAge.disable();
        return;
      }

      this.selectedRace = race;

      if (this.selectedRace.name === 'Odöd') {
        this.chooseAge.disable();
      } else {
        this.chooseAge.enable();
      }

      this.ages = this.selectedRace.ageModifications.map((props) => {
        return { name: props.name, age: props.age };
      });
    });

    this.selectedAge$ = this.chooseAge.valueChanges.subscribe((age) => {
      const selectedAge = this.selectedRace.ageModifications.find((a) => a.name === age);

      if (!selectedAge) {
        return;
      }

      this.buildService.setChosenAge(selectedAge.name);

      this.resetBonus();

      const totalBonus = {
        additiveBonus: { ...additiveBonus },
        multiplierBonus: {
          stamina: selectedAge.stamina,
          strength: selectedAge.strength,
          endurance: selectedAge.endurance,
          initiative: selectedAge.initiative,
          dodge: selectedAge.dodge,
          shield: selectedAge.shield,
          weaponSkill: selectedAge.weaponSkill,
        },
      };

      this.armoryService.addBonus('age', totalBonus);
      this.armoryService.emitBonusesHaveBeenAdded();
    });

    this.importedAge$ = this.buildService.getChosenAge().subscribe((age) => {
      if (age) {
        this.chooseAge.patchValue(age, { emitEvent: false });
      }
    });

    this.wipe$ = this.buildService.listenWipeData().subscribe(() => {
      this.chooseAge.reset();
      this.chooseAge.disable();
    });
  }
  ngOnDestroy(): void {
    this.selectedRace$.unsubscribe();
    this.selectedAge$.unsubscribe();
    this.importedAge$.unsubscribe();
    this.wipe$.unsubscribe();
  }

  private resetBonus(): void {
    this.armoryService.addBonus('age', { additiveBonus: additiveBonus, multiplierBonus: multiplierBonus });
  }
}

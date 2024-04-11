import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../../../support/services/global.service';
import { Subscription } from 'rxjs';
import { BuildService } from '../../../support/services/build.service';

@Component({
  selector: 'select-race',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './select-race.component.html',
  styleUrl: './select-race.component.css',
})
export class SelectRaceComponent implements OnDestroy {
  public chooseRace = new FormControl('');
  public races: string[] = this.globalService.races.map((race) => race.name!);

  private incomingRace$: Subscription = new Subscription();
  private internalRace$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private globalService: GlobalService) {
    this.incomingRace$ = this.buildService.getChosenRace().subscribe((race) => {
      this.chooseRace.patchValue(race, { emitEvent: false });
    });

    this.internalRace$ = this.chooseRace.valueChanges.subscribe((race) => {
      if (race) this.buildService.setChosenRace(race);
    });
  }

  ngOnDestroy(): void {
    this.incomingRace$.unsubscribe();
    this.internalRace$.unsubscribe();
  }
}

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
  private localRace$: Subscription = new Subscription();
  private wipeData$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private globalService: GlobalService) {
    this.incomingRace$ = this.buildService.getChosenRace().subscribe((race) => {
      this.chooseRace.patchValue(race, { emitEvent: false });
    });

    this.localRace$ = this.chooseRace.valueChanges.subscribe((race) => {
      if (race) this.buildService.setChosenRace(race);
    });

    this.wipeData$ = this.buildService.listenWipeData().subscribe(() => {
      this.chooseRace.patchValue(null, { emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this.incomingRace$.unsubscribe();
    this.localRace$.unsubscribe();
    this.wipeData$.unsubscribe();
  }
}

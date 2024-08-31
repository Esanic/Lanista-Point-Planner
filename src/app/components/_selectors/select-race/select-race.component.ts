import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BuildService } from '../../../support/services/build.service';
import { emptyString } from '../../../support/constants/common';
import { CommonHelper } from '../../../support/helpers/common.helper';

@Component({
  selector: 'select-race',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './select-race.component.html',
  styleUrl: './select-race.component.css',
})
export class SelectRaceComponent implements OnInit, OnDestroy {
  public chooseRace = new FormControl(emptyString);
  // public races: string[] = this.globalService.races.map((race) => race.name!);
  public races: string[] = this.buildService.getRaces().map((race) => race.name);

  private incomingRace$: Subscription = new Subscription();
  private localRace$: Subscription = new Subscription();
  private wipeData$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private commonHelper: CommonHelper) {}

  ngOnInit(): void {
    this.incomingRace$ = this.buildService.getChosenRace().subscribe((race) => {
      this.chooseRace.patchValue(race.name, { emitEvent: false });
    });

    this.localRace$ = this.chooseRace.valueChanges.subscribe((raceName) => {
      const race = this.commonHelper.selectRaceFromRaceName(raceName!);

      if (raceName) {
        this.buildService.setChosenRace(race);
        this.buildService.emitDeselectBuild({});
      }
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

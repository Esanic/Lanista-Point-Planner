import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuildService } from '../../../support/services/build.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-level-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './level-input.component.html',
  styleUrl: './level-input.component.css',
})
export class LevelInputComponent implements OnInit, OnDestroy {
  levels: FormControl = new FormControl();

  private levels$: Subscription = new Subscription();
  private getAmountOfLevels$: Subscription = new Subscription();
  private listenWipeData$: Subscription = new Subscription();

  constructor(private buildService: BuildService) {}

  ngOnInit() {
    this.levels.setValue(25);

    this.levels$ = this.levels.valueChanges.subscribe((value) => {
      if (value < 1) {
        value = 1;
      }
      if (value > 45) {
        value = 45;
      }

      this.buildService.setAmountOfLevels(value);
    });

    this.getAmountOfLevels$ = this.buildService.getAmountOfLevels().subscribe((levels) => {
      this.levels.setValue(levels, { emitEvent: false });
    });

    this.listenWipeData$ = this.buildService.listenWipeData().subscribe(() => {
      this.levels.setValue(25);
    });
  }

  ngOnDestroy(): void {
    this.levels$.unsubscribe();
    this.getAmountOfLevels$.unsubscribe();
    this.listenWipeData$.unsubscribe();
  }
}

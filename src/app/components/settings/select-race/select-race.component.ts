import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../../../support/services/global.service';
import {MatSelectModule} from '@angular/material/select'; 

@Component({
  selector: 'select-race',
  standalone: true,
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './select-race.component.html',
  styleUrl: './select-race.component.css'
})
export class SelectRaceComponent {
  public chooseRace = new FormControl('');
  public races: string[] = this.global.races.map(race => race.name!);


  constructor(private global: GlobalService){
    this.chooseRace.valueChanges.subscribe(race => {
      if(race)
        this.global.setChosenRace(race);
    })
  }

}

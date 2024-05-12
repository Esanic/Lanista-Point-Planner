import { Component } from '@angular/core';
import { SelectMainhandComponent } from '../../_selectors/select-mainhand/select-mainhand.component';

@Component({
  selector: 'app-armory',
  standalone: true,
  imports: [SelectMainhandComponent],
  templateUrl: './armory.component.html',
  styleUrl: './armory.component.css',
})
export class ArmoryComponent {}

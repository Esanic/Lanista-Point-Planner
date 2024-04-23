import { Component } from '@angular/core';
import { BuildService } from '../../../support/services/build.service';

@Component({
  selector: 'app-wipe-button',
  standalone: true,
  imports: [],
  templateUrl: './wipe-button.component.html',
  styleUrl: './wipe-button.component.css',
})
export class WipeButtonComponent {
  constructor(private buildService: BuildService) {}

  wipeTable() {
    this.buildService.emitWipeData('');
  }
}

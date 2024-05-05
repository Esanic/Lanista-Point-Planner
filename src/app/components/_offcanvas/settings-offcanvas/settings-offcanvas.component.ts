import { Component } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from '../../_containers/settings/settings.component';

@Component({
  selector: 'app-settings-offcanvas',
  standalone: true,
  imports: [SettingsComponent],
  templateUrl: './settings-offcanvas.component.html',
  styleUrl: './settings-offcanvas.component.css',
})
export class SettingsOffcanvasComponent {
  constructor(public activeOffcanvas: NgbActiveOffcanvas) {}
}

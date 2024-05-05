import { Component } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ArmoryComponent } from '../../_containers/armory/armory.component';

@Component({
  selector: 'app-armory-offcanvas',
  standalone: true,
  imports: [ArmoryComponent],
  templateUrl: './armory-offcanvas.component.html',
  styleUrl: './armory-offcanvas.component.css',
})
export class ArmoryOffcanvasComponent {
  constructor(public activeOffcanvas: NgbActiveOffcanvas) {}
}

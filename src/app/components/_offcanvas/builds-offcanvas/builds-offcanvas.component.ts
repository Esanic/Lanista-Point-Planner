import { Component } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BuildsComponent } from '../../_containers/builds/builds/builds.component';

@Component({
  selector: 'app-builds-offcanvas',
  standalone: true,
  imports: [BuildsComponent],
  templateUrl: './builds-offcanvas.component.html',
  styleUrl: './builds-offcanvas.component.css',
})
export class BuildsOffcanvasComponent {
  constructor(public activeOffcanvas: NgbActiveOffcanvas) {}
}

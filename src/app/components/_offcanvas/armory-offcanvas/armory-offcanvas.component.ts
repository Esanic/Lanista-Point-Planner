import { Component, OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ArmoryComponent } from '../../_containers/armory/armory.component';
import { ArmoryService } from '../../../support/services/armory.service';

@Component({
  selector: 'app-armory-offcanvas',
  standalone: true,
  imports: [ArmoryComponent],
  templateUrl: './armory-offcanvas.component.html',
  styleUrl: './armory-offcanvas.component.css',
})
export class ArmoryOffcanvasComponent implements OnInit {
  constructor(public activeOffcanvas: NgbActiveOffcanvas, private armoryService: ArmoryService) {}
  ngOnInit(): void {
    this.armoryService.getGear();
  }
}

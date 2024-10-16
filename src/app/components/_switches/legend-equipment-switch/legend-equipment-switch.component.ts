import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArmoryService } from '../../../support/services/armory.service';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-legend-equipment-switch',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './legend-equipment-switch.component.html',
  styleUrl: './legend-equipment-switch.component.css',
})
export class LegendEquipmentSwitchComponent implements OnInit, OnDestroy {
  public viewLegendEquipment = new FormControl(false);

  private incomingLegendViewStatus$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();

  constructor(private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.incomingLegendViewStatus$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((status) => {
      this.viewLegendEquipment.patchValue(status, { emitEvent: false });
    });

    this.viewLegendEquipment$ = this.viewLegendEquipment.valueChanges.subscribe((value) => {
      if (value) this.armoryService.setLegendEquipmentViewStatus(value);
    });
  }

  ngOnDestroy(): void {
    this.incomingLegendViewStatus$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
  }
}

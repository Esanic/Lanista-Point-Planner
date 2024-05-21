import { Component } from '@angular/core';
import { ArmoryService } from '../../../support/services/armory.service';

@Component({
  selector: 'app-legend-equipment-switch',
  standalone: true,
  imports: [],
  templateUrl: './legend-equipment-switch.component.html',
  styleUrl: './legend-equipment-switch.component.css',
})
export class LegendEquipmentSwitchComponent {
  constructor(private armoryService: ArmoryService) {}
  toggleLegendEquipment(event: any) {
    this.armoryService.setLegendEquipmentViewStatus(event.originalTarget.checked);
  }
}

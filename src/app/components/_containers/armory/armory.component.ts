import { Component } from '@angular/core';
import { SelectMainhandComponent } from '../../_selectors/_armory/select-mainhand/select-mainhand.component';
import { LegendEquipmentSwitchComponent } from '../../_switch/legend-equipment-switch/legend-equipment-switch.component';

@Component({
  selector: 'app-armory',
  standalone: true,
  imports: [SelectMainhandComponent, LegendEquipmentSwitchComponent],
  templateUrl: './armory.component.html',
  styleUrl: './armory.component.css',
})
export class ArmoryComponent {}

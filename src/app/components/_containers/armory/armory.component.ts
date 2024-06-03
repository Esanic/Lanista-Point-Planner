import { Component } from '@angular/core';
import { SelectMainhandComponent } from '../../_selectors/_armory/_weapons/select-mainhand/select-mainhand.component';
import { LegendEquipmentSwitchComponent } from '../../_switch/legend-equipment-switch/legend-equipment-switch.component';
import { SelectOffhandComponent } from '../../_selectors/_armory/_weapons/select-offhand/select-offhand.component';

@Component({
  selector: 'app-armory',
  standalone: true,
  imports: [SelectMainhandComponent, LegendEquipmentSwitchComponent, SelectOffhandComponent],
  templateUrl: './armory.component.html',
  styleUrl: './armory.component.css',
})
export class ArmoryComponent {}

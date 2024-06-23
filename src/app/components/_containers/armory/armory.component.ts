import { Component } from '@angular/core';
import { SelectMainhandComponent } from '../../_selectors/_armory/_weapons/select-mainhand/select-mainhand.component';
import { LegendEquipmentSwitchComponent } from '../../_switch/legend-equipment-switch/legend-equipment-switch.component';
import { SelectOffhandComponent } from '../../_selectors/_armory/_weapons/select-offhand/select-offhand.component';
import { SelectArmorComponent } from '../../_selectors/_armory/select-armor/select-armor.component';
import { armorSlots } from '../../../support/enums/armor.enums';

@Component({
  selector: 'app-armory',
  standalone: true,
  imports: [SelectMainhandComponent, LegendEquipmentSwitchComponent, SelectOffhandComponent, SelectArmorComponent],
  templateUrl: './armory.component.html',
  styleUrl: './armory.component.css',
})
export class ArmoryComponent {
  public armorSlots = armorSlots;
}

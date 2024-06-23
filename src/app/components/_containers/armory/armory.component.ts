import { Component } from '@angular/core';
import { LegendEquipmentSwitchComponent } from '../../_switch/legend-equipment-switch/legend-equipment-switch.component';
import { SelectArmorComponent } from '../../_selectors/_armory/select-armor/select-armor.component';
import { armorSlots } from '../../../support/enums/armor.enums';
import { SelectWeaponComponent } from '../../_selectors/_armory/select-weapon/select-weapon.component';

@Component({
  selector: 'app-armory',
  standalone: true,
  imports: [LegendEquipmentSwitchComponent, SelectArmorComponent, SelectWeaponComponent],
  templateUrl: './armory.component.html',
  styleUrl: './armory.component.css',
})
export class ArmoryComponent {
  public armorSlots = armorSlots;
}

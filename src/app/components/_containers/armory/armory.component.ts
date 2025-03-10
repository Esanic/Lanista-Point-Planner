import { Component } from '@angular/core';
import { LegendEquipmentSwitchComponent } from '../../_switches/legend-equipment-switch/legend-equipment-switch.component';
import { SelectArmorComponent } from '../../_selectors/_armory/select-armor/select-armor.component';
import { armorSlots } from '../../../support/enums/armor.enums';
import { SelectWeaponComponent } from '../../_selectors/_armory/select-weapon/select-weapon.component';
import { accessoriesSlots } from '../../../support/enums/accessories.enums';
import { SelectAccessoryComponent } from '../../_selectors/_armory/select-accessory/select-accessory.component';
import { SelectConsumableComponent } from '../../_selectors/_armory/select-consumable/select-consumable.component';
import { SelectEnchantComponent } from '../../_selectors/_armory/select-enchant/select-enchant.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-armory',
  standalone: true,
  imports: [LegendEquipmentSwitchComponent, SelectWeaponComponent, SelectArmorComponent, SelectAccessoryComponent, SelectConsumableComponent, SelectEnchantComponent, NgbNavModule],
  templateUrl: './armory.component.html',
  styleUrl: './armory.component.css',
})
export class ArmoryComponent {
  public armorSlots = armorSlots;
  public accessoriesSlots = accessoriesSlots;
  public activeTab = 1;
}

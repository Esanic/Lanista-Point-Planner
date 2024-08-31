import { Pipe, PipeTransform } from '@angular/core';
import { armorSlots } from '../enums/armor.enums';
import { emptyString } from '../constants/common';

@Pipe({
  name: 'armor',
  standalone: true,
})
export class ArmorPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case armorSlots.Head:
        return 'Huvud';
      case armorSlots.Shoulders:
        return 'Axlar';
      case armorSlots.Chest:
        return 'Harnesk';
      case armorSlots.Hands:
        return 'Händer';
      case armorSlots.Legs:
        return 'Ben';
      case armorSlots.Feet:
        return 'Fötter';
      default:
        return emptyString;
    }
  }
}

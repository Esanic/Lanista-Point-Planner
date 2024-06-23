import { Pipe, PipeTransform } from '@angular/core';
import { armorSlots } from '../enums/armor.enums';

@Pipe({
  name: 'armor',
  standalone: true,
})
export class ArmorPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case armorSlots.Head:
        return 'Hjälm';
      case armorSlots.Shoulders:
        return 'Axlar';
      case armorSlots.Chest:
        return 'Bröst';
      case armorSlots.Legs:
        return 'Ben';
      case armorSlots.Hands:
        return 'Händer';
      case armorSlots.Feet:
        return 'Fötter';
      default:
        return '';
    }
  }
}

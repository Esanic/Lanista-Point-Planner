import { Pipe, PipeTransform } from '@angular/core';
import { accessoriesSlots } from '../enums/accessories.enums';
import { emptyString } from '../constants/common';

@Pipe({
  name: 'accessories',
  standalone: true,
})
export class AccessoriesPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case accessoriesSlots.Cloak:
        return 'Mantel';
      case accessoriesSlots.Necklace:
        return 'Halsband';
      case accessoriesSlots.Ring:
        return 'Ring';
      case accessoriesSlots.Amulet:
        return 'Amulett';
      case accessoriesSlots.Bracelet:
        return 'Armband';
      case accessoriesSlots.Trinket:
        return 'Ornament';
      default:
        return emptyString;
    }
  }
}

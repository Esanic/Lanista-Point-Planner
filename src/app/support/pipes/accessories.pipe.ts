import { Pipe, PipeTransform } from '@angular/core';
import { accessoriesSlots } from '../enums/accessories.enums';
import { emptyString } from '../constants/global';

@Pipe({
  name: 'accessories',
  standalone: true,
})
export class AccessoriesPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case accessoriesSlots.Back:
        return 'Mantel';
      case accessoriesSlots.Neck:
        return 'Halsband';
      case accessoriesSlots.Finger:
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

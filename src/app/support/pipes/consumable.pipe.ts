import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'consumable',
  standalone: true,
})
export class ConsumablePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Mixtur 1';
      case 2:
        return 'Mixtur 2';
      case 3:
        return 'Mixtur 3';
      default:
        return 'Mixtur';
    }
  }
}

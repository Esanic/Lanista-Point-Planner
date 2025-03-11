import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true,
})
export class AgePipe implements PipeTransform {
  transform(age: string): string {
    switch (age) {
      case 'young':
        return 'Ung';
      case 'adult':
        return 'Vuxen';
      case 'middle':
        return 'Medelålders';
      case 'old':
        return 'Gammal';
      case 'ancient':
        return 'Uråldrig';
      default:
        return '';
    }
  }
}

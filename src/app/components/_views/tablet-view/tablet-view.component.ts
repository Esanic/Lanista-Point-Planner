import { Component } from '@angular/core';
import { TableComponent } from '../../_tables/table/table.component';
import { MobileNavComponent } from '../../_nav/mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-tablet-view',
  standalone: true,
  imports: [TableComponent, MobileNavComponent],
  templateUrl: './tablet-view.component.html',
  styleUrl: './tablet-view.component.css',
})
export class TabletViewComponent {}

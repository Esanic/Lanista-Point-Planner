import { Component } from '@angular/core';
import { MobileNavComponent } from '../../_nav/mobile-nav/mobile-nav.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../_tables/table/table.component';

@Component({
  selector: 'app-mobile-view',
  standalone: true,
  imports: [CommonModule, MobileNavComponent, TableComponent],
  templateUrl: './mobile-view.component.html',
  styleUrl: './mobile-view.component.css',
})
export class MobileViewComponent {}

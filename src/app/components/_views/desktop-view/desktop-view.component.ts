import { Component } from '@angular/core';
import { SettingsComponent } from '../../_containers/settings/settings.component';
import { BuildsComponent } from '../../_containers/builds/builds/builds.component';
import { TableComponent } from '../../_tables/table/table.component';
import { ArmoryComponent } from '../../_containers/armory/armory.component';
import { DonateComponent } from '../../_containers/donate/donate.component';

@Component({
  selector: 'app-desktop-view',
  standalone: true,
  imports: [SettingsComponent, BuildsComponent, TableComponent, ArmoryComponent, DonateComponent],
  templateUrl: './desktop-view.component.html',
  styleUrl: './desktop-view.component.css',
})
export class DesktopViewComponent {}

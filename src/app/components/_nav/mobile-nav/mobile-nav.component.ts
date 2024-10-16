import { Component } from '@angular/core';
import { ArmoryComponent } from '../../_containers/armory/armory.component';
import { SettingsComponent } from '../../_containers/settings/settings.component';
import { BuildsComponent } from '../../_containers/builds/builds/builds.component';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [ArmoryComponent, SettingsComponent, BuildsComponent],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.css',
})
export class MobileNavComponent {}

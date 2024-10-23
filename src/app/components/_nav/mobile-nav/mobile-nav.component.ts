import { Component, HostListener } from '@angular/core';
import { ArmoryComponent } from '../../_containers/armory/armory.component';
import { SettingsComponent } from '../../_containers/settings/settings.component';
import { BuildsComponent } from '../../_containers/builds/builds/builds.component';
import { DonateComponent } from '../../_containers/donate/donate.component';
import { CommonModule } from '@angular/common';
import { NavbarBrandComponent } from '../navbar-brand/navbar-brand.component';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [ArmoryComponent, SettingsComponent, BuildsComponent, DonateComponent, CommonModule, NavbarBrandComponent],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.css',
})
export class MobileNavComponent {
  public screenWidth: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth = event.target.innerWidth;
  }

  public widthOfCanvas(): string {
    return this.screenWidth < 768 ? 'w-100' : 'w-50';
  }
}

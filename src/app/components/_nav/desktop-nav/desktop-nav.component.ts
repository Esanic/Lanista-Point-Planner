import { Component } from '@angular/core';
import { NavbarBrandComponent } from '../navbar-brand/navbar-brand.component';

@Component({
  selector: 'app-desktop-nav',
  standalone: true,
  imports: [NavbarBrandComponent],
  templateUrl: './desktop-nav.component.html',
  styleUrl: './desktop-nav.component.css',
})
export class DesktopNavComponent {}

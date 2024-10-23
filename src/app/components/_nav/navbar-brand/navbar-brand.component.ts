import { Component, Input } from '@angular/core';
const { version: appVersion } = require('../../../../../package.json');

@Component({
  selector: 'app-navbar-brand',
  standalone: true,
  imports: [],
  templateUrl: './navbar-brand.component.html',
  styleUrl: './navbar-brand.component.css',
})
export class NavbarBrandComponent {
  public version = appVersion;

  @Input() public iconSize: string | undefined;

  constructor() {}

  public getIconSize(): string {
    return this.iconSize || '32';
  }
}

import { Component, HostListener, Input, OnInit } from '@angular/core';
import { DonateComponent } from '../../_containers/donate/donate.component';
import { CommonModule } from '@angular/common';
const { version: appVersion } = require('../../../../../package.json');

@Component({
  selector: 'app-navbar-brand',
  standalone: true,
  imports: [DonateComponent, CommonModule],
  templateUrl: './navbar-brand.component.html',
  styleUrl: './navbar-brand.component.css',
})
export class NavbarBrandComponent implements OnInit {
  public version = appVersion;
  public screenWidth: number = 0;

  @Input() public iconSize: string | undefined;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth = event.target.innerWidth;
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  public getIconSize(): string {
    return this.iconSize || '32';
  }

  public widthOfCanvas(): string {
    if (this.screenWidth != 0) {
      return this.screenWidth < 768 ? 'w-100' : 'w-25';
    }
    return 'w-100';
  }
}

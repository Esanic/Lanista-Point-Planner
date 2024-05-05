import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SettingsOffcanvasComponent } from '../../_offcanvas/settings-offcanvas/settings-offcanvas.component';
import { BuildsOffcanvasComponent } from '../../_offcanvas/builds-offcanvas/builds-offcanvas.component';
import { ArmoryOffcanvasComponent } from '../../_offcanvas/armory-offcanvas/armory-offcanvas.component';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [SettingsOffcanvasComponent, BuildsOffcanvasComponent, ArmoryOffcanvasComponent],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.css',
})
export class MobileNavComponent {
  constructor(private offcanvasService: NgbOffcanvas) {}

  public toggleSettings(): void {
    this.offcanvasService.open(SettingsOffcanvasComponent, { position: 'top' });
  }

  public toggleBuilds(): void {
    this.offcanvasService.open(BuildsOffcanvasComponent, { position: 'top' });
  }

  public toggleArmory(): void {
    this.offcanvasService.open(ArmoryOffcanvasComponent, { position: 'top' });
  }
}

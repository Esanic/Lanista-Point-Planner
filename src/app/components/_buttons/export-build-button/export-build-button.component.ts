import { Component } from '@angular/core';
import { TableService } from '../../../support/services/table.service';
import { firstValueFrom } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IBuild } from '../../../support/interfaces/build';
import { BuildService } from '../../../support/services/build.service';
@Component({
  selector: 'app-export-build-button',
  standalone: true,
  imports: [NgbPopover],
  templateUrl: './export-build-button.component.html',
  styleUrl: './export-build-button.component.css',
})
export class ExportBuildButtonComponent {
  private build: IBuild = {} as IBuild;

  constructor(private buildService: BuildService, private clipboard: Clipboard) {}

  async exportBuild(): Promise<void> {
    this.build = await firstValueFrom(this.buildService.getStatsFromTable());
    this.clipboard.copy(JSON.stringify(this.build, null, 2));
  }
}

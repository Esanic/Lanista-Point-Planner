import { Component } from '@angular/core';
import { TableService } from '../../../support/services/table.service';
import { firstValueFrom } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-export-build-button',
  standalone: true,
  imports: [NgbPopover],
  templateUrl: './export-build-button.component.html',
  styleUrl: './export-build-button.component.css',
})
export class ExportBuildButtonComponent {
  public points: any;

  constructor(private tableService: TableService, private clipboard: Clipboard) {}

  async exportBuild(): Promise<void> {
    this.points = await firstValueFrom(this.tableService.getPoints());

    this.clipboard.copy(JSON.stringify(this.points, null, 2));
  }
}

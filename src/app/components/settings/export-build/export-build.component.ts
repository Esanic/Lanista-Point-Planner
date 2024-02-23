import { Component } from '@angular/core';
import { TableService } from '../../../support/services/table.service';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard'; 
import { PopoverModule } from '@coreui/angular';

@Component({
  selector: 'app-export-build',
  standalone: true,
  imports: [MatButtonModule, PopoverModule],
  templateUrl: './export-build.component.html',
  styleUrl: './export-build.component.css'
})
export class ExportBuildComponent {

  public points: any;

  constructor(private tableService: TableService, private clipboard: Clipboard){}

  async exportBuild(): Promise<void> {
    this.points = await firstValueFrom(this.tableService.getPoints());

    this.clipboard.copy(JSON.stringify(this.points, null, 2))
  }

}

import { Component, OnDestroy } from '@angular/core';
import { TableService } from '../../../support/services/table.service';
import { Subscription, firstValueFrom } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-export-build',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './export-build.component.html',
  styleUrl: './export-build.component.css'
})
export class ExportBuildComponent implements OnDestroy {

  public points: any;

  private points$: Subscription = new Subscription;

  constructor(private tableService: TableService){}
  ngOnDestroy(): void {
    this.points$.unsubscribe
  }

  async exportBuild(): Promise<void> {


    this.points = await firstValueFrom(this.tableService.getPoints());
    console.log(this.points);
  }

}

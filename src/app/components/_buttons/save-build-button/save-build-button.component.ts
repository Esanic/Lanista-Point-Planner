import { Component } from '@angular/core';
import { TableService } from '../../../support/services/table.service';
import { firstValueFrom } from 'rxjs';
import { IBuild } from '../../../support/interfaces/build';

@Component({
  selector: 'app-save-build-button',
  standalone: true,
  imports: [],
  templateUrl: './save-build-button.component.html',
  styleUrl: './save-build-button.component.css',
})
export class SaveBuildButtonComponent {
  private build: IBuild = {} as IBuild;

  constructor(private tableService: TableService) {}

  public async saveBuild(): Promise<void> {
    this.build = await firstValueFrom(this.tableService.getPoints());

    if (this.build.race === 'Default' && this.build.weaponSkill === '') {
      return;
    }

    this.build.name = this.build.weaponSkill + ' ' + this.build.race;

    let builds = JSON.parse(localStorage.getItem('builds')!);
    builds.push(this.build);

    localStorage.setItem('builds', JSON.stringify(builds));
  }
}

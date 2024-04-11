import { Component } from '@angular/core';
import { BuildService } from '../../../support/services/build.service';
import { IBuild } from '../../../support/interfaces/build';
import { read } from '@popperjs/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-delete-build-button',
  standalone: true,
  imports: [],
  templateUrl: './delete-build-button.component.html',
  styleUrl: './delete-build-button.component.css',
})
export class DeleteBuildButtonComponent {
  private build: IBuild = {} as IBuild;

  constructor(private buildService: BuildService) {
    this.buildService.getSelectedBuild().subscribe((build) => {
      this.build = build;
    });
  }

  public async deleteBuild(): Promise<void> {
    let builds: IBuild[] = JSON.parse(localStorage.getItem('builds')!);

    const indexToRemove = builds.findIndex((build: IBuild) => build.name === this.build.name);

    builds.splice(indexToRemove, 1);

    localStorage.setItem('builds', JSON.stringify(builds));

    this.buildService.emitUpdateBuildList('');
    //Make sure to remove data from race, weaponskill and table
  }
}

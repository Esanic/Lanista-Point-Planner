import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IBuild } from '../../../support/interfaces/build';
import { BuildService } from '../../../support/services/build.service';
import { BuildNameModalComponent } from '../../_modals/build-name-modal/build-name-modal.component';

@Component({
  selector: 'app-save-build-button',
  standalone: true,
  imports: [BuildNameModalComponent],
  templateUrl: './save-build-button.component.html',
  styleUrl: './save-build-button.component.css',
})
export class SaveBuildButtonComponent {
  private build: IBuild = {} as IBuild;

  private buildName: string = '';

  public viewBuildNameModal = false;

  constructor(private buildService: BuildService) {}

  public async saveBuild(): Promise<void> {
    this.build = await firstValueFrom(this.buildService.getStatsFromTable());

    if (this.build.race === 'Default' && this.build.weaponSkill === '') {
      return;
    }

    this.build.name = this.buildName;

    let builds = JSON.parse(localStorage.getItem('builds')!);
    builds.push(this.build);

    localStorage.setItem('builds', JSON.stringify(builds));

    this.buildService.emitUpdateBuildList('');
  }

  //* Methods for opening and closing the modal
  public openBuildNameModal(): void {
    this.viewBuildNameModal = true;
  }
  public closeBuildNameModal(name: string): void {
    this.viewBuildNameModal = false;
    this.buildName = name;
    this.saveBuild();
  }
  public dismissBuildNameModal(): void {
    this.viewBuildNameModal = false;
  }
}

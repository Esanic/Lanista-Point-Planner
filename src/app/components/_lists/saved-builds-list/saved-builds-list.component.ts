import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IBuild } from '../../../support/interfaces/build';
import { BuildService } from '../../../support/services/build.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-builds-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-builds-list.component.html',
  styleUrl: './saved-builds-list.component.css',
})
export class SavedBuildsListComponent {
  public builds: IBuild[] = [];
  public selectedBuildName: string = '';

  constructor(private buildService: BuildService) {
    this.getBuildsFromLocalStorage();

    this.buildService.listenToUpdateBuildList().subscribe(() => {
      this.getBuildsFromLocalStorage();
    });
  }

  private getBuildsFromLocalStorage(): void {
    this.builds = JSON.parse(localStorage.getItem('builds')!);
  }

  public selectBuild(build: IBuild): void {
    const selectedBuild = this.builds.find((b) => b.name === build.name);

    if (selectedBuild !== undefined) {
      if (selectedBuild.name !== undefined) this.selectedBuildName = selectedBuild.name;

      this.buildService.setSelectedBuild(selectedBuild);

      this.buildService.setChosenRace(selectedBuild.race);
      this.buildService.setChosenWeaponSkill(selectedBuild.weaponSkill);
      this.buildService.setImportedStats(selectedBuild.levels);
    }
  }

  public deleteBuild(build: IBuild): void {
    const buildToDelete = this.builds.findIndex((b: IBuild) => b.name === build.name);

    this.builds.splice(buildToDelete, 1);

    localStorage.setItem('builds', JSON.stringify(this.builds));

    this.buildService.emitUpdateBuildList('');
    this.buildService.emitWipeData('');
  }
}

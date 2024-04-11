import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../../../support/services/global.service';
import { BuildService } from '../../../support/services/build.service';
import { IBuild } from '../../../support/interfaces/build';

@Component({
  selector: 'app-select-build',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-build.component.html',
  styleUrl: './select-build.component.css',
})
export class SelectBuildComponent {
  public selectBuild = new FormControl('');

  public builds: IBuild[] = [];

  constructor(private buildService: BuildService) {
    this.getBuildsFromLocalStorage();

    this.selectBuild.valueChanges.subscribe((value) => {
      const selectedBuild = this.builds.find((build) => build.name === value);

      if (selectedBuild != undefined) {
        this.buildService.setSelectedBuild(selectedBuild);

        this.buildService.setChosenRace(selectedBuild.race);
        this.buildService.setChosenWeaponSkill(selectedBuild.weaponSkill);
        this.buildService.setImportedStats(selectedBuild.levels);
      }
    });

    this.buildService.listenToUpdateBuildList().subscribe(() => {
      this.getBuildsFromLocalStorage();
    });
  }

  private getBuildsFromLocalStorage(): void {
    this.builds = JSON.parse(localStorage.getItem('builds')!);
  }
}

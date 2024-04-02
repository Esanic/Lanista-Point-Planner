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

  constructor(private globalService: GlobalService, private buildService: BuildService) {
    this.builds = JSON.parse(localStorage.getItem('builds')!);

    this.selectBuild.valueChanges.subscribe((value) => {
      const selectedBuild = this.builds.find((build) => build.name === value);

      if (selectedBuild != undefined) {
        this.buildService.setSelectedBuild(selectedBuild);

        this.globalService.setChosenRace(selectedBuild.race);
        this.globalService.setChosenWeaponSkill(selectedBuild.weaponSkill);
        this.globalService.setImportedStats(selectedBuild.levels);
      }
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBuild } from '../../../support/interfaces/build';
import { BuildService } from '../../../support/services/build.service';
import { CommonModule } from '@angular/common';
import { ConfirmActionModalComponent } from '../../_modals/confirm-action-modal/confirm-action-modal.component';
import { Subscription } from 'rxjs';
import { emptyString } from '../../../support/constants/common';
import { getBuilds, setBuilds } from '../../../support/helpers/common.helper';

@Component({
  selector: 'app-saved-builds-list',
  standalone: true,
  imports: [CommonModule, ConfirmActionModalComponent],
  templateUrl: './saved-builds-list.component.html',
  styleUrl: './saved-builds-list.component.css',
})
export class SavedBuildsListComponent implements OnInit, OnDestroy {
  public builds: IBuild[] = [];
  public selectedBuildName: string = emptyString;

  private buildToDelete: IBuild = {} as IBuild;

  public viewOpenDeleteConfirmModal = false;

  private listenToUpdateBuildList$: Subscription = new Subscription();
  private listenWipeData$: Subscription = new Subscription();
  private deselectBuild$: Subscription = new Subscription();

  constructor(private buildService: BuildService) {}

  ngOnInit(): void {
    this.builds = getBuilds();

    this.selectBuildUponInit();

    this.listenToUpdateBuildList$ = this.buildService.listenToUpdateBuildList().subscribe((buildName) => {
      this.builds = getBuilds();
      if (buildName !== emptyString) {
        this.selectBuild({ name: buildName } as IBuild, true);
      }
    });

    this.listenWipeData$ = this.buildService.listenWipeData().subscribe(() => {
      this.selectedBuildName = emptyString;
    });

    this.deselectBuild$ = this.buildService.listenDeselectBuild().subscribe(() => {
      this.selectedBuildName = emptyString;
    });
  }

  ngOnDestroy(): void {
    this.listenToUpdateBuildList$.unsubscribe();
    this.listenWipeData$.unsubscribe();
    this.deselectBuild$.unsubscribe();
  }

  private selectBuildUponInit() {
    const selectedBuild: IBuild | null = this.buildService.getSelectedBuildVar();
    if (selectedBuild) {
      this.selectBuild(selectedBuild);
    }
  }

  public selectBuild(build: IBuild, updateList?: boolean): void {
    //* If the build is already selected, deselect it
    if (updateList === false || updateList === undefined) {
      if (build.name === this.selectedBuildName) {
        this.selectedBuildName = emptyString;
        this.buildService.emitWipeData(emptyString);
        this.buildService.setSelectedBuild({} as IBuild);
        return;
      }
    }

    //* If the build is not selected, select it
    const selectedBuild = this.builds.find((b) => b.name === build.name);

    if (selectedBuild !== undefined) {
      if (selectedBuild.name !== undefined) this.selectedBuildName = selectedBuild.name;

      this.buildService.setSelectedBuild(selectedBuild);
      this.buildService.setAmountOfLevels(selectedBuild.levels.length);
      this.buildService.setChosenRace(this.buildService.selectRaceFromRaceName(selectedBuild.race));
      this.buildService.setChosenWeaponSkill(selectedBuild.weaponSkill);
      this.buildService.setImportedStats(selectedBuild.levels);
    }
  }

  public deleteBuild(build: IBuild): void {
    const buildToDelete = this.builds.findIndex((b: IBuild) => b.name === build.name);

    this.builds.splice(buildToDelete, 1);

    setBuilds(this.builds);

    this.buildService.emitUpdateBuildList(emptyString);

    if (this.selectedBuildName === build.name) {
      this.buildService.emitWipeData(emptyString);
    }

    this.buildService.setSelectedBuild({} as IBuild);

    this.resetBuildToDelete();
  }

  public openDeleteConfirmModal(build: IBuild): void {
    this.viewOpenDeleteConfirmModal = true;
    this.buildToDelete = build;
  }

  public closeDeleteConfirmModal(): void {
    this.viewOpenDeleteConfirmModal = false;
    this.deleteBuild(this.buildToDelete);
  }

  public dismissDeleteConfirmModal(): void {
    this.viewOpenDeleteConfirmModal = false;
    this.resetBuildToDelete();
  }

  private resetBuildToDelete(): void {
    this.buildToDelete = {} as IBuild;
  }
}

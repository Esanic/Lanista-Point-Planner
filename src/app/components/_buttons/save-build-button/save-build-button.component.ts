import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { IBuild } from '../../../support/interfaces/build';
import { BuildService } from '../../../support/services/build.service';
import { BuildNameModalComponent } from '../../_modals/build-name-modal/build-name-modal.component';
import { NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { emptyString } from '../../../support/constants/common';
import { getBuilds, setBuilds } from '../../../support/helpers/common.helper';
import { convertWeaponSkillIdToName } from '../../../support/helpers/armory.helper';
import { ArmoryService } from '../../../support/services/armory.service';
import { IGear } from '../../../support/interfaces/_armory/gear';

@Component({
  selector: 'app-save-build-button',
  standalone: true,
  imports: [BuildNameModalComponent, NgbPopoverModule],
  templateUrl: './save-build-button.component.html',
  styleUrl: './save-build-button.component.css',
})
export class SaveBuildButtonComponent implements OnInit, OnDestroy {
  private build: IBuild = {} as IBuild;

  private buildName: string = emptyString;

  public viewBuildNameModal = false;

  private listenToDeselectBuild$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.listenToDeselectBuild$ = this.buildService.listenDeselectBuild().subscribe(() => {
      this.build = {} as IBuild;
      this.buildName = emptyString;
    });
  }

  ngOnDestroy(): void {
    this.listenToDeselectBuild$.unsubscribe();
  }

  public async saveBuild(saved?: boolean): Promise<void> {
    if (this.build.race === 'Default' && this.build.weaponSkill === emptyString) {
      //TODO: Add error message
      return;
    }

    this.build = await this.buildService.getCurrentBuild();

    this.build.name = this.buildName;
    const builds = getBuilds();

    if (saved) {
      builds[builds.findIndex((b) => b.name === this.build.name)] = this.build;
      setBuilds(builds);
      this.buildService.emitUpdateBuildList(this.build.name);
      return;
    }

    builds.push(this.build);
    setBuilds(builds);

    this.buildService.emitUpdateBuildList(this.build.name);
  }

  //* Methods for opening and closing the modal
  public async openBuildNameModal(popover: NgbPopover): Promise<void> {
    const selectedBuild = await firstValueFrom(this.buildService.getSelectedBuild());

    if (selectedBuild !== undefined && selectedBuild.name !== undefined) {
      this.buildName = selectedBuild.name;
      this.saveBuild(true);

      popover.open();
      setTimeout(() => {
        popover.close();
      }, 1000);
    } else {
      this.viewBuildNameModal = true;
    }
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

import { Component } from '@angular/core';
import { BuildService } from '../../../support/services/build.service';
import { IBuild } from '../../../support/interfaces/build';

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
    this.buildService.getSelectedBuild().subscribe((build) => {});
  }
}

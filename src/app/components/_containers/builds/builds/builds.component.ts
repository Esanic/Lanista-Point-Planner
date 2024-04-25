import { Component } from '@angular/core';
import { ExportBuildButtonComponent } from '../../../_buttons/export-build-button/export-build-button.component';
import { ImportBuildButtonComponent } from '../../../_buttons/import-build-button/import-build-button.component';
import { SaveBuildButtonComponent } from '../../../_buttons/save-build-button/save-build-button.component';
import { SavedBuildsListComponent } from '../../../_lists/saved-builds-list/saved-builds-list.component';

@Component({
  selector: 'app-builds',
  standalone: true,
  imports: [ExportBuildButtonComponent, ImportBuildButtonComponent, SaveBuildButtonComponent, SavedBuildsListComponent],
  templateUrl: './builds.component.html',
  styleUrl: './builds.component.css',
})
export class BuildsComponent {}

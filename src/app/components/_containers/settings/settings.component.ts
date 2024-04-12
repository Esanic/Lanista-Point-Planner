import { Component } from '@angular/core';
import { SelectRaceComponent } from '../../_selectors/select-race/select-race.component';
import { SelectWeaponSkillComponent } from '../../_selectors/select-weapon-skill/select-weapon-skill.component';
import { ExportBuildButtonComponent } from '../../_buttons/export-build-button/export-build-button.component';
import { ImportBuildButtonComponent } from '../../_buttons/import-build-button/import-build-button.component';

import { SaveBuildButtonComponent } from '../../_buttons/save-build-button/save-build-button.component';

import { SavedBuildsListComponent } from '../../_lists/saved-builds-list/saved-builds-list.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SelectRaceComponent, SelectWeaponSkillComponent, ExportBuildButtonComponent, ImportBuildButtonComponent, SaveBuildButtonComponent, SavedBuildsListComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {}

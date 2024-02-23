import { Component } from '@angular/core';
import { SelectRaceComponent } from './select-race/select-race.component';
import { SelectWeaponSkillComponent } from './select-weapon-skill/select-weapon-skill.component';
import { ExportBuildComponent } from './export-build/export-build.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SelectRaceComponent, SelectWeaponSkillComponent, ExportBuildComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  public exportBuild(){

  }
}

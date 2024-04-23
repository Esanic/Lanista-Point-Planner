import { Component } from '@angular/core';
import { SelectRaceComponent } from '../../_selectors/select-race/select-race.component';
import { SelectWeaponSkillComponent } from '../../_selectors/select-weapon-skill/select-weapon-skill.component';
import { LevelInputComponent } from '../../_inputs/level-input/level-input.component';
import { WipeButtonComponent } from '../../_buttons/wipe-button/wipe-button.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SelectRaceComponent, SelectWeaponSkillComponent, LevelInputComponent, WipeButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {}

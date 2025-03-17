import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BuildService } from '../../../support/services/build.service';
import { IRace } from '../../../support/interfaces/race';
import { emptyString } from '../../../support/constants/common';
import { weaponSkillsNames } from '../../../support/constants/weaponSkills';
import { selectRaceBonusFromWeaponSkill } from '../../../support/helpers/build.helper';
import { convertWeaponSkillIdToName } from '../../../support/helpers/armory.helper';

@Component({
  selector: 'select-weapon-skill',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './select-weapon-skill.component.html',
  styleUrl: './select-weapon-skill.component.css',
})
export class SelectWeaponSkillComponent implements OnInit, OnDestroy {
  public chooseWeaponSkill = new FormControl(emptyString);
  public weaponSkills: string[] = [...weaponSkillsNames];
  private selectedRace: IRace = {} as IRace;

  private selectedRace$: Subscription = new Subscription();
  private incomingWeaponSkill$: Subscription = new Subscription();
  private chosenWeaponSkill$: Subscription = new Subscription();
  private wipeData$: Subscription = new Subscription();

  constructor(private buildService: BuildService) {}

  ngOnInit(): void {
    this.selectedRace$ = this.buildService.getChosenRace().subscribe((race: IRace) => {
      let selectedWeaponSkill: string = emptyString;
      if (this.chooseWeaponSkill.value !== emptyString && this.chooseWeaponSkill.value !== null) {
        selectedWeaponSkill = this.chooseWeaponSkill.value.split(' ')[0]; //TODO: Add this to a helper function
      }

      this.selectedRace = race;
      this.weaponSkills = weaponSkillsNames;

      if (race.weaponSkills) {
        this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
          return `${weaponSkill} (${selectRaceBonusFromWeaponSkill(weaponSkill, race)}%)`;
        });

        this.chooseWeaponSkill.patchValue(`${selectedWeaponSkill} (${selectRaceBonusFromWeaponSkill(selectedWeaponSkill, race)}%)`, { emitEvent: false });
      }
    });

    this.incomingWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      const weaponSkillString = convertWeaponSkillIdToName(weaponSkill);
      if (this.selectedRace.weaponSkills) {
        this.chooseWeaponSkill.patchValue(`${weaponSkillString} (${selectRaceBonusFromWeaponSkill(weaponSkillString, this.selectedRace)}%)`, { emitEvent: false });
      } else {
        this.chooseWeaponSkill.patchValue(weaponSkillString, { emitEvent: false });
      }
    });

    this.chosenWeaponSkill$ = this.chooseWeaponSkill.valueChanges.subscribe((weaponSkill) => {
      if (weaponSkill) {
        this.buildService.setChosenWeaponSkill(weaponSkill);
      }
    });

    this.wipeData$ = this.buildService.listenWipeData().subscribe(() => {
      this.chooseWeaponSkill.patchValue(null, { emitEvent: false });
      this.buildService.setChosenWeaponSkill('none');
    });
  }

  ngOnDestroy(): void {
    this.selectedRace$.unsubscribe();
    this.incomingWeaponSkill$.unsubscribe();
    this.chosenWeaponSkill$.unsubscribe();
    this.wipeData$.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BuildService } from '../../../support/services/build.service';
import { IRace } from '../../../support/interfaces/race';
import { emptyString } from '../../../support/constants/common';
import { weaponSkillsNames } from '../../../support/constants/weaponSkills';
import { CommonHelper } from '../../../support/helpers/common.helper';

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

  private incomingWeaponSkill$: Subscription = new Subscription();
  private internalWeaponSkill$: Subscription = new Subscription();
  private selectedRace$: Subscription = new Subscription();
  private wipeData$: Subscription = new Subscription();

  constructor(private commonHelper: CommonHelper, private buildService: BuildService) {}

  ngOnInit(): void {
    this.selectedRace$ = this.buildService.getChosenRace().subscribe((race: IRace) => {
      let selectedWeaponSkill: string = emptyString;
      if (this.chooseWeaponSkill.value !== emptyString && this.chooseWeaponSkill.value !== null) {
        selectedWeaponSkill = this.chooseWeaponSkill.value.split(' ')[0];
      }

      this.selectedRace = race;
      this.weaponSkills = weaponSkillsNames;

      if (race.weaponSkills) {
        this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
          return `${weaponSkill} (${this.commonHelper.selectRaceBonusFromWeaponSkill(weaponSkill, race)}%)`;
        });

        this.chooseWeaponSkill.patchValue(`${selectedWeaponSkill} (${this.commonHelper.selectRaceBonusFromWeaponSkill(selectedWeaponSkill, race)}%)`, { emitEvent: false });
      }
    });

    this.incomingWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      if (this.selectedRace.weaponSkills) {
        this.chooseWeaponSkill.patchValue(`${weaponSkill} (${this.commonHelper.selectRaceBonusFromWeaponSkill(weaponSkill, this.selectedRace)}%)`, { emitEvent: false });
      } else {
        this.chooseWeaponSkill.patchValue(weaponSkill, { emitEvent: false });
      }
    });

    this.internalWeaponSkill$ = this.chooseWeaponSkill.valueChanges.subscribe((weaponSkill) => {
      if (weaponSkill) {
        this.buildService.setChosenWeaponSkill(weaponSkill);
        this.buildService.emitDeselectBuild({});
      }
    });

    this.wipeData$ = this.buildService.listenWipeData().subscribe(() => {
      this.chooseWeaponSkill.patchValue(null, { emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this.incomingWeaponSkill$.unsubscribe();
    this.internalWeaponSkill$.unsubscribe();
    this.wipeData$.unsubscribe();
    this.selectedRace$.unsubscribe();
  }
}

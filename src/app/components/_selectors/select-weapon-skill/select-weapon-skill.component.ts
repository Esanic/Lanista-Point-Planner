import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../../../support/services/global.service';
import { Subscription } from 'rxjs';
import { BuildService } from '../../../support/services/build.service';
import { IRace } from '../../../support/interfaces/race';

@Component({
  selector: 'select-weapon-skill',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './select-weapon-skill.component.html',
  styleUrl: './select-weapon-skill.component.css',
})
export class SelectWeaponSkillComponent implements OnInit, OnDestroy {
  public chooseWeaponSkill = new FormControl('');
  public weaponSkills: string[] = this.globalService.weaponSkills;
  private selectedRace: IRace = {} as IRace;

  private incomingWeaponSkill$: Subscription = new Subscription();
  private internalWeaponSkill$: Subscription = new Subscription();
  private selectedRace$: Subscription = new Subscription();
  private wipeData$: Subscription = new Subscription();

  constructor(private globalService: GlobalService, private buildService: BuildService) {}

  ngOnInit(): void {
    this.selectedRace$ = this.buildService.getChosenRace().subscribe((race: IRace) => {
      let selectedWeaponSkill: string = '';
      if (this.chooseWeaponSkill.value !== '' && this.chooseWeaponSkill.value !== null) {
        selectedWeaponSkill = this.chooseWeaponSkill.value;
      }

      this.selectedRace = race;
      this.weaponSkills = this.globalService.weaponSkills;

      if (race.weaponSkills) {
        this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
          return `${weaponSkill} (${this.globalService.selectRaceBonusFromWeaponSkill(weaponSkill, race)}%)`;
        });

        this.chooseWeaponSkill.patchValue(`${selectedWeaponSkill} (${this.globalService.selectRaceBonusFromWeaponSkill(selectedWeaponSkill, race)}%)`, { emitEvent: false });
      }
    });

    this.incomingWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      if (this.selectedRace.weaponSkills) {
        if (weaponSkill.split(' ').length >= 2) {
          this.chooseWeaponSkill.patchValue(weaponSkill, { emitEvent: false });
        } else {
          this.chooseWeaponSkill.patchValue(`${weaponSkill} (${this.globalService.selectRaceBonusFromWeaponSkill(weaponSkill, this.selectedRace)}%)`, { emitEvent: false });
        }
      } else {
        this.chooseWeaponSkill.patchValue(weaponSkill, { emitEvent: false });
      }
    });

    this.internalWeaponSkill$ = this.chooseWeaponSkill.valueChanges.subscribe((weaponSkill) => {
      if (weaponSkill) {
        this.buildService.setChosenWeaponSkill(weaponSkill);
        this.buildService.emitDeselectBuild({});
        this.buildService.emitWipeTable({});
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

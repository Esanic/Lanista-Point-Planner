import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '../../../support/services/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'select-weapon-skill',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './select-weapon-skill.component.html',
  styleUrl: './select-weapon-skill.component.css',
})
export class SelectWeaponSkillComponent implements OnDestroy {
  public chooseWeaponSkill = new FormControl('');
  public weaponSkills: string[] = this.globalService.weaponSkills;

  private incomingWeaponSkill$: Subscription = new Subscription();
  private internalWeaponSkill$: Subscription = new Subscription();

  constructor(private globalService: GlobalService) {
    this.incomingWeaponSkill$ = this.globalService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      this.chooseWeaponSkill.patchValue(weaponSkill, { emitEvent: false });
    });

    this.internalWeaponSkill$ = this.chooseWeaponSkill.valueChanges.subscribe((weaponSkill) => {
      if (weaponSkill) this.globalService.setChosenWeaponSkill(weaponSkill);
    });
  }

  ngOnDestroy(): void {
    this.incomingWeaponSkill$.unsubscribe();
    this.internalWeaponSkill$.unsubscribe();
  }
}

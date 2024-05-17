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
  private chosenRace: IRace = {} as IRace;

  private incomingWeaponSkill$: Subscription = new Subscription();
  private internalWeaponSkill$: Subscription = new Subscription();
  private selectedRace$: Subscription = new Subscription();
  private wipeData$: Subscription = new Subscription();

  constructor(private globalService: GlobalService, private buildService: BuildService) {}

  ngOnInit(): void {
    this.incomingWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      if (this.chosenRace) {
        this.chooseWeaponSkill.patchValue(this.attachRaceBonusToWeaponSkill(weaponSkill, this.chosenRace), { emitEvent: false });
      } else {
        this.chooseWeaponSkill.patchValue(weaponSkill, { emitEvent: false });
      }
    });

    this.selectedRace$ = this.buildService.getChosenRace().subscribe((race: IRace) => {
      this.chosenRace = race;
      this.weaponSkills = this.globalService.weaponSkills;

      switch (race.name) {
        case 'Människa': {
          this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
            return this.attachRaceBonusToWeaponSkill(weaponSkill, this.globalService.human);
          });
          break;
        }
        case 'Alv': {
          this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
            return this.attachRaceBonusToWeaponSkill(weaponSkill, this.globalService.elf);
          });
          break;
        }
        case 'Dvärg': {
          this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
            return this.attachRaceBonusToWeaponSkill(weaponSkill, this.globalService.dwarf);
          });
          break;
        }
        case 'Ork': {
          this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
            return this.attachRaceBonusToWeaponSkill(weaponSkill, this.globalService.orc);
          });
          break;
        }
        case 'Goblin': {
          this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
            return this.attachRaceBonusToWeaponSkill(weaponSkill, this.globalService.goblin);
          });
          break;
        }
        case 'Troll': {
          this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
            return this.attachRaceBonusToWeaponSkill(weaponSkill, this.globalService.troll);
          });
          break;
        }
        case 'Odöd': {
          this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
            return this.attachRaceBonusToWeaponSkill(weaponSkill, this.globalService.undead);
          });
          break;
        }
        case 'Salamanth': {
          this.weaponSkills = this.weaponSkills.map((weaponSkill: string) => {
            return this.attachRaceBonusToWeaponSkill(weaponSkill, this.globalService.salamanth);
          });
          break;
        }
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

  public attachRaceBonusToWeaponSkill(weaponSkill: string, race: IRace): string {
    switch (weaponSkill) {
      case 'Yxa':
        return `Yxa (${Math.round((race.weaponSkills.axe - 1) * 100)}%)`;
      case 'Svärd':
        return `Svärd (${Math.round((race.weaponSkills.sword - 1) * 100)}%)`;
      case 'Hammare':
        return `Hammare (${Math.round((race.weaponSkills.mace - 1) * 100)}%)`;
      case 'Stav':
        return `Stav (${Math.round((race.weaponSkills.stave - 1) * 100)}%)`;
      case 'Sköld':
        return `Sköld (${Math.round((race.weaponSkills.shield - 1) * 100)}%)`;
      case 'Stickvapen':
        return `Stickvapen (${Math.round((race.weaponSkills.spear - 1) * 100)}%)`;
      case 'Kätting':
        return `Kätting (${Math.round((race.weaponSkills.chain - 1) * 100)}%)`;
    }
    return '';
  }
}

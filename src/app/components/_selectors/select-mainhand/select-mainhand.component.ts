import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuildService } from '../../../support/services/build.service';
import { Subscription } from 'rxjs';
import { Weapon } from '../../../support/interfaces/weapon';
import { GlobalService } from '../../../support/services/global.service';

@Component({
  selector: 'app-select-mainhand',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './select-mainhand.component.html',
  styleUrl: './select-mainhand.component.css',
})
export class SelectMainhandComponent implements OnInit, OnDestroy {
  public chosenMainhand = new FormControl('');

  public weaponArray: Weapon[] = [];

  private chosenWeaponSkill$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private globalService: GlobalService) {}

  //TODO: Make select weapon skill component emit the chosen weapon skill as a number instead of string.

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      this.selectWeaponArray(weaponSkill);
    });
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  private selectWeaponArray(weaponSkill: string): void {
    switch (weaponSkill) {
      case 'Yxa': {
        this.weaponArray = this.globalService.axe;
        break;
      }
      case 'Svärd': {
        this.weaponArray = this.globalService.sword;
        break;
      }
      case 'Hammare': {
        this.weaponArray = this.globalService.mace;
        break;
      }
      case 'Stav': {
        this.weaponArray = this.globalService.stave;
        break;
      }
      case 'Sköld': {
        this.weaponArray = this.globalService.shield;
        break;
      }
      case 'Spjut': {
        this.weaponArray = this.globalService.spear;
        break;
      }
      case 'Kätting': {
        this.weaponArray = this.globalService.chain;
        break;
      }
    }
  }
}

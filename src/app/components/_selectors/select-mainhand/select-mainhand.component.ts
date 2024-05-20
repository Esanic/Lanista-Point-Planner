import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuildService } from '../../../support/services/build.service';
import { Subscription } from 'rxjs';
import { Weapon } from '../../../support/interfaces/weapon';
import { GlobalService } from '../../../support/services/global.service';
import { ArmoryService } from '../../../support/services/armory.service';

@Component({
  selector: 'app-select-mainhand',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './select-mainhand.component.html',
  styleUrl: './select-mainhand.component.css',
})
export class SelectMainhandComponent implements OnInit, OnDestroy {
  public chosenMainhand = new FormControl('');

  public viewLegendEquipment: boolean = false;

  public weaponArray: Weapon[] = [];

  private chosenWeaponSkill$: Subscription = new Subscription();
  private viewLegendEquipment$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private globalService: GlobalService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      this.selectWeaponArray(weaponSkill.split(' ')[0]);
    });

    this.viewLegendEquipment$ = this.armoryService.getLegendEquipmentViewStatus().subscribe((legendEquipmentViewStatus) => {
      this.viewLegendEquipment = legendEquipmentViewStatus;
    });
  }

  ngOnDestroy(): void {
    this.chosenWeaponSkill$.unsubscribe();
    this.viewLegendEquipment$.unsubscribe();
  }

  private selectWeaponArray(weaponSkill: string): void {
    switch (weaponSkill) {
      case 'Yxa': {
        console.log();
        this.weaponArray = this.globalService.axe.map((axe) => {
          if (this.viewLegendEquipment && axe.requires_legend) {
            return axe;
          } else if (!this.viewLegendEquipment && !axe.requires_legend) {
            return axe;
          } else {
            return {} as Weapon;
          }
        });
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
      case 'Stickvapen': {
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

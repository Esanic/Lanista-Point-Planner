import { Injectable } from '@angular/core';

import { IRace } from '../interfaces/race';
import { BuildService } from '../services/build.service';

@Injectable({
  providedIn: 'root',
})
export class CommonHelper {
  constructor(private buildService: BuildService) {}

  public selectRaceFromRaceName(raceName: string): IRace {
    switch (raceName) {
      case 'Människa': {
        return this.buildService.getHuman();
      }
      case 'Alv': {
        return this.buildService.getElf();
      }
      case 'Dvärg': {
        return this.buildService.getDwarf();
      }
      case 'Ork': {
        return this.buildService.getOrc();
      }
      case 'Goblin': {
        return this.buildService.getGoblin();
      }
      case 'Troll': {
        return this.buildService.getTroll();
      }
      case 'Odöd': {
        return this.buildService.getUndead();
      }
      case 'Salamanth': {
        return this.buildService.getSalamanth();
      }
      default: {
        return this.buildService.getDefaultRace();
      }
    }
  }

  public selectRaceBonusFromWeaponSkill(weaponSkill: string, race: IRace): number {
    switch (weaponSkill) {
      case 'Yxa': {
        return Math.round((race.weaponSkills.axe - 1) * 100);
      }
      case 'Svärd': {
        return Math.round((race.weaponSkills.sword - 1) * 100);
      }
      case 'Hammare': {
        return Math.round((race.weaponSkills.mace - 1) * 100);
      }
      case 'Stav': {
        return Math.round((race.weaponSkills.stave - 1) * 100);
      }
      case 'Sköld': {
        return Math.round((race.weaponSkills.shield - 1) * 100);
      }
      case 'Stick': {
        return Math.round((race.weaponSkills.spear - 1) * 100);
      }
      case 'Kätting': {
        return Math.round((race.weaponSkills.chain - 1) * 100);
      }
      default: {
        return 0;
      }
    }
  }
}

import { Component, Host, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './support/services/api.service';
import { Stats } from './support/enums/stats.enums';
import { weaponSkillsNum } from './support/enums/weapon-skills.enums';
import { IApiBonuses, IApiRace, IRace } from './support/interfaces/race';
import { DesktopViewComponent } from './components/_views/desktop-view/desktop-view.component';
import { MobileViewComponent } from './components/_views/mobile-view/mobile-view.component';
import { TabletViewComponent } from './components/_views/tablet-view/tablet-view.component';
import { IWeapon } from './support/interfaces/_armory/weapon';
import { IArmor } from './support/interfaces/_armory/armor';
import { armorSlots } from './support/enums/armor.enums';
import { ArmoryService } from './support/services/armory.service';
import { accessoriesSlots } from './support/enums/accessories.enums';
import { IAccessory } from './support/interfaces/_armory/accessory';
import { BuildService } from './support/services/build.service';
import { Races } from './support/enums/races';
import { dwarf, elf, goblin, human, orc, salamanth, troll, undead } from './support/constants/templates';
import { BuildHelper } from './support/helpers/build.helper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DesktopViewComponent, MobileViewComponent, TabletViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private globalRaces = this.buildService.getRaces();

  public screenWidth: number = 0;

  constructor(private apiService: ApiService, private buildService: BuildService, private buildHelper: BuildHelper, private armoryService: ArmoryService) {}

  /** To determine programmatically what view to use depending on the users device size. */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth = event.target.innerWidth;
  }

  ngOnInit(): void {
    if (localStorage.getItem('builds') === null) {
      localStorage.setItem('builds', JSON.stringify([]));
    }

    this.screenWidth = window.innerWidth;

    /**
     * Fetching races from API
     */
    this.apiService.getRaces().subscribe({
      next: (res) => {
        const human = { id: res.races[0].id, stats: res.races[0].bonuses.stats, weapon_skills: res.races[0].bonuses.weapon_skills } as IApiRace;
        const elf = { id: res.races[1].id, stats: res.races[1].bonuses.stats, weapon_skills: res.races[1].bonuses.weapon_skills } as IApiRace;
        const dwarf = { id: res.races[2].id, stats: res.races[2].bonuses.stats, weapon_skills: res.races[2].bonuses.weapon_skills } as IApiRace;
        const orc = { id: res.races[3].id, stats: res.races[3].bonuses.stats, weapon_skills: res.races[3].bonuses.weapon_skills } as IApiRace;
        const troll = { id: res.races[4].id, stats: res.races[4].bonuses.stats, weapon_skills: res.races[4].bonuses.weapon_skills } as IApiRace;
        const goblin = { id: res.races[5].id, stats: res.races[5].bonuses.stats, weapon_skills: res.races[5].bonuses.weapon_skills } as IApiRace;
        const undead = { id: res.races[6].id, stats: res.races[6].bonuses.stats, weapon_skills: res.races[6].bonuses.weapon_skills } as IApiRace;
        const salamanth = { id: res.races[7].id, stats: res.races[7].bonuses.stats, weapon_skills: res.races[7].bonuses.weapon_skills } as IApiRace;

        const races: any[] = [human, elf, dwarf, orc, troll, goblin, undead, salamanth];

        races.forEach((race) => {
          this.assignRacesData(race);
        });
      },
    });

    /**
     * Fetching weapons from API
     */
    this.apiService.getWeapons().subscribe({
      next: (res) => {
        const weapons: IWeapon[] = res;

        weapons.forEach((weapon: IWeapon) => {
          this.assignWeaponToArray(weapon);
        });
      },
      error: (err) => {},
    });

    /**
     * Fetching enchants from API
     */
    //! Not implemented yet
    this.apiService.getEnchants().subscribe({
      next: (res) => {
        const enchants = res;
      },
      error: (err) => {},
    });

    /**
     * Fetching armors and accessories from API
     */
    this.apiService.getArmors().subscribe({
      next: (res) => {
        const armors: IArmor[] = res;

        armors.forEach((armor: IArmor) => {
          this.assignArmorAndAccessoriesToArray(armor);
        });

        this.armoryService.emitArmorsAndAccessoriesFetched();
      },
      error: (err) => {},
    });

    /**
     * Fetching accessories from API
     */
    this.apiService.getConsumables().subscribe({
      next: (res) => {
        this.armoryService.consumables = res;
        this.armoryService.emitConsumablesFetched();
      },
      error: (err) => {},
    });
  }

  private assignRacesData(race: IApiRace): void {
    switch (race.id) {
      case Races.human: {
        this.buildService.setHuman(this.buildHelper.bonusAssigner(race, human));
        break;
      }
      case Races.elf: {
        this.buildService.setElf(this.buildHelper.bonusAssigner(race, elf));
        break;
      }
      case Races.dwarf: {
        this.buildService.setDwarf(this.buildHelper.bonusAssigner(race, dwarf));
        break;
      }
      case Races.orc: {
        this.buildService.setOrc(this.buildHelper.bonusAssigner(race, orc));
        break;
      }
      case Races.troll: {
        this.buildService.setTroll(this.buildHelper.bonusAssigner(race, troll));
        break;
      }
      case Races.goblin: {
        this.buildService.setGoblin(this.buildHelper.bonusAssigner(race, goblin));
        break;
      }
      case Races.undead: {
        this.buildService.setUndead(this.buildHelper.bonusAssigner(race, undead));
        break;
      }
      case Races.salamanth: {
        this.buildService.setSalamanth(this.buildHelper.bonusAssigner(race, salamanth));
        break;
      }
    }
  }

  private assignWeaponToArray(weapon: IWeapon): void {
    switch (weapon.type) {
      case weaponSkillsNum.Axe: {
        this.armoryService.axe.push(weapon);
        break;
      }
      case weaponSkillsNum.Sword: {
        this.armoryService.sword.push(weapon);
        break;
      }
      case weaponSkillsNum.Mace: {
        this.armoryService.mace.push(weapon);
        break;
      }
      case weaponSkillsNum.Stave: {
        this.armoryService.stave.push(weapon);
        break;
      }
      case weaponSkillsNum.Shield: {
        this.armoryService.shield.push(weapon);
        break;
      }
      case weaponSkillsNum.Spear: {
        this.armoryService.spear.push(weapon);
        break;
      }
      case weaponSkillsNum.Chain: {
        this.armoryService.chain.push(weapon);
        break;
      }
    }
  }

  private assignArmorAndAccessoriesToArray(equipment: IArmor | IAccessory): void {
    switch (equipment.type) {
      case armorSlots.Head: {
        this.armoryService.head.push(equipment);
        break;
      }
      case armorSlots.Shoulders: {
        this.armoryService.shoulders.push(equipment);
        break;
      }
      case armorSlots.Chest: {
        this.armoryService.chest.push(equipment);
        break;
      }
      case armorSlots.Hands: {
        this.armoryService.gloves.push(equipment);
        break;
      }
      case armorSlots.Legs: {
        this.armoryService.legs.push(equipment);
        break;
      }
      case armorSlots.Feet: {
        this.armoryService.boots.push(equipment);
        break;
      }
      case accessoriesSlots.Back: {
        this.armoryService.back.push(equipment);
        break;
      }
      case accessoriesSlots.Neck: {
        this.armoryService.neck.push(equipment);
        break;
      }
      case accessoriesSlots.Finger: {
        this.armoryService.finger.push(equipment);
        break;
      }
      case accessoriesSlots.Amulet: {
        this.armoryService.amulet.push(equipment);
        break;
      }
      case accessoriesSlots.Bracelet: {
        this.armoryService.bracelet.push(equipment);
        break;
      }
      case accessoriesSlots.Trinket: {
        this.armoryService.trinket.push(equipment);
        break;
      }
    }
  }
}

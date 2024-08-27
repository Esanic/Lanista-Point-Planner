import { Component, Host, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './support/services/api.service';
import { GlobalService } from './support/services/global.service';
import { Stats } from './support/enums/stats.enums';
import { weaponSkillsNum } from './support/enums/weapon-skills.enums';
import { IRace } from './support/interfaces/race';
import { DesktopViewComponent } from './components/_views/desktop-view/desktop-view.component';
import { MobileViewComponent } from './components/_views/mobile-view/mobile-view.component';
import { TabletViewComponent } from './components/_views/tablet-view/tablet-view.component';
import { IWeapon } from './support/interfaces/_armory/weapon';
import { IArmor } from './support/interfaces/_armory/armor';
import { armorSlots } from './support/enums/armor.enums';
import { ArmoryService } from './support/services/armory.service';
import { accessoriesSlots } from './support/enums/accessories.enums';
import { IConsumable } from './support/interfaces/_armory/consumables';
import { IAccessory } from './support/interfaces/_armory/accessory';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DesktopViewComponent, MobileViewComponent, TabletViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private globalRaces = this.globalService.races;

  public screenWidth: number = 0;

  constructor(private apiService: ApiService, private globalService: GlobalService, private armoryService: ArmoryService) {}

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

    //* Fetching race data from API
    this.apiService.getRaces().subscribe({
      next: (res) => {
        const human = res.races[0].bonuses;
        const elf = res.races[1].bonuses;
        const dwarf = res.races[2].bonuses;
        const orc = res.races[3].bonuses;
        const troll = res.races[4].bonuses;
        const goblin = res.races[5].bonuses;
        const undead = res.races[6].bonuses;
        const salamanth = res.races[7].bonuses;

        const races: any[] = [human, elf, dwarf, orc, troll, goblin, undead, salamanth];

        this.globalRaces.forEach((race, index) => {
          this.assignRacesData(race, races[index]);
        });
      },
    });

    //* Fetching weapons from API
    this.apiService.getWeapons().subscribe({
      next: (res) => {
        const weapons: IWeapon[] = res;

        weapons.forEach((weapon: IWeapon) => {
          this.assignWeaponToArray(weapon);
        });
      },
      error: (err) => {},
    });

    //* Fetching enchants from API
    //! Not implemented yet
    this.apiService.getEnchants().subscribe({
      next: (res) => {
        const enchants = res;
      },
      error: (err) => {},
    });

    //* Fetching armors from API
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

    //* Fetching consumables from API
    this.apiService.getConsumables().subscribe({
      next: (res) => {
        this.globalService.consumables = res;
        this.armoryService.emitConsumablesFetched();
      },
      error: (err) => {},
    });
  }

  private assignRacesData(race: IRace, changes: any): void {
    race.stats = {
      stamina: changes.stats.find((stat: any) => stat.type === Stats.Stamina).value,
      strength: changes.stats.find((stat: any) => stat.type === Stats.Strength).value,
      endurance: changes.stats.find((stat: any) => stat.type === Stats.Endurance).value,
      initiative: changes.stats.find((stat: any) => stat.type === Stats.Initiative).value,
      dodge: changes.stats.find((stat: any) => stat.type === Stats.Dodge).value,
      learningCapacity: changes.stats.find((stat: any) => stat.type === Stats.LearningCapacity).value,
      luck: changes.stats.find((stat: any) => stat.type === Stats.Luck).value,
      discipline: changes.stats.find((stat: any) => stat.type === Stats.Discipline).value,
    };

    race.weaponSkills = {
      axe: changes.weapon_skills.find((skill: any) => skill.type === weaponSkillsNum.Axe).value,
      sword: changes.weapon_skills.find((skill: any) => skill.type === weaponSkillsNum.Sword).value,
      mace: changes.weapon_skills.find((skill: any) => skill.type === weaponSkillsNum.Mace).value,
      stave: changes.weapon_skills.find((skill: any) => skill.type === weaponSkillsNum.Stave).value,
      shield: changes.weapon_skills.find((skill: any) => skill.type === weaponSkillsNum.Shield).value,
      spear: changes.weapon_skills.find((skill: any) => skill.type === weaponSkillsNum.Spear).value,
      chain: changes.weapon_skills.find((skill: any) => skill.type === weaponSkillsNum.Chain).value,
    };
  }

  private assignWeaponToArray(weapon: IWeapon): void {
    switch (weapon.type) {
      case weaponSkillsNum.Axe: {
        this.globalService.axe.push(weapon);
        break;
      }
      case weaponSkillsNum.Sword: {
        this.globalService.sword.push(weapon);
        break;
      }
      case weaponSkillsNum.Mace: {
        this.globalService.mace.push(weapon);
        break;
      }
      case weaponSkillsNum.Stave: {
        this.globalService.stave.push(weapon);
        break;
      }
      case weaponSkillsNum.Shield: {
        this.globalService.shield.push(weapon);
        break;
      }
      case weaponSkillsNum.Spear: {
        this.globalService.spear.push(weapon);
        break;
      }
      case weaponSkillsNum.Chain: {
        this.globalService.chain.push(weapon);
        break;
      }
    }
  }

  private assignArmorAndAccessoriesToArray(equipment: IArmor | IAccessory): void {
    switch (equipment.type) {
      case armorSlots.Head: {
        this.globalService.head.push(equipment);
        break;
      }
      case armorSlots.Shoulders: {
        this.globalService.shoulders.push(equipment);
        break;
      }
      case armorSlots.Chest: {
        this.globalService.chest.push(equipment);
        break;
      }
      case armorSlots.Hands: {
        this.globalService.gloves.push(equipment);
        break;
      }
      case armorSlots.Legs: {
        this.globalService.legs.push(equipment);
        break;
      }
      case armorSlots.Feet: {
        this.globalService.boots.push(equipment);
        break;
      }
      case accessoriesSlots.Back: {
        this.globalService.back.push(equipment);
        break;
      }
      case accessoriesSlots.Neck: {
        this.globalService.neck.push(equipment);
        break;
      }
      case accessoriesSlots.Finger: {
        this.globalService.finger.push(equipment);
        break;
      }
      case accessoriesSlots.Amulet: {
        this.globalService.amulet.push(equipment);
        break;
      }
      case accessoriesSlots.Bracelet: {
        this.globalService.bracelet.push(equipment);
        break;
      }
      case accessoriesSlots.Trinket: {
        this.globalService.trinket.push(equipment);
        break;
      }
    }
  }
}

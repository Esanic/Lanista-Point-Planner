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
import { IWeapon } from './support/interfaces/weapon';

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

  constructor(private apiService: ApiService, private globalService: GlobalService) {}

  ngOnInit(): void {
    if (localStorage.getItem('builds') === null) {
      localStorage.setItem('builds', JSON.stringify([]));
    }

    this.screenWidth = window.innerWidth;

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
          this.assignApiData(race, races[index]);
        });
      },
    });

    this.apiService.getWeapons().subscribe({
      next: (res) => {
        const weapons: IWeapon[] = res;

        weapons.forEach((weapon: IWeapon) => {
          this.assignWeaponToArray(weapon);
        });

        console.log(this.globalService.mace);
      },
      error: (err) => {},
    });
  }

  private assignApiData(race: IRace, changes: any): void {
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth = event.target.innerWidth;
  }
}

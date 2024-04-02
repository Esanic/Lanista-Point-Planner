import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from './components/_tables/table/table.component';
import { SettingsComponent } from './components/_containers/settings/settings.component';
import { ApiService } from './support/services/api.service';
import { GlobalService } from './support/services/global.service';
import { Stats } from './support/enums/stats.enums';
import { WeaponSkills } from './support/enums/weapon-skills.enums';
import { IRace } from './support/interfaces/race';
import { ArmoryComponent } from './components/_containers/armory/armory.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableComponent, SettingsComponent, ArmoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private globalRaces = this.globalService.races;

  constructor(
    private apiService: ApiService,
    private globalService: GlobalService){
      this.apiService.getRaces().subscribe({
        next: res => {
          const human = res.races[0].bonuses;
          const elf = res.races[1].bonuses;
          const dwarf = res.races[2].bonuses;
          const orc = res.races[3].bonuses;
          const troll = res.races[4].bonuses;
          const goblin = res.races[5].bonuses;
          const undead = res.races[6].bonuses;
  
          const races: any[] = [human, elf, dwarf, orc, troll, goblin, undead]
  
          this.globalRaces.forEach((race, index) => {
            this.assignApiData(race, races[index]);
          })
        }
      })
    }

  assignApiData(race: IRace, changes: any): void {
    race.stats = {
      stamina: changes.stats.find((stat: any) => stat.type === Stats.Stamina).value,
      strength: changes.stats.find((stat: any) => stat.type === Stats.Strength).value,
      endurance: changes.stats.find((stat: any) => stat.type === Stats.Endurance).value,
      initiative: changes.stats.find((stat: any) => stat.type === Stats.Initiative).value,
      dodge: changes.stats.find((stat: any) => stat.type === Stats.Dodge).value,
      learningCapacity: changes.stats.find((stat: any) => stat.type === Stats.LearningCapacity).value,
      luck: changes.stats.find((stat: any) => stat.type === Stats.Luck).value,
      discipline: changes.stats.find((stat: any) => stat.type === Stats.Discipline).value,
    }

    race.weaponSkills = {
      axe: changes.weapon_skills.find((skill: any) => skill.type === WeaponSkills.Axe).value,
      sword: changes.weapon_skills.find((skill: any) => skill.type === WeaponSkills.Sword).value,
      mace: changes.weapon_skills.find((skill: any) => skill.type === WeaponSkills.Mace).value,
      stave: changes.weapon_skills.find((skill: any) => skill.type === WeaponSkills.Stave).value,
      shield: changes.weapon_skills.find((skill: any) => skill.type === WeaponSkills.Shield).value,
      spear: changes.weapon_skills.find((skill: any) => skill.type === WeaponSkills.Spear).value,
      chain: changes.weapon_skills.find((skill: any) => skill.type === WeaponSkills.Chain).value,
    }
  }
}

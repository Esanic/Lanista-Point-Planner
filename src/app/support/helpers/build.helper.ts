import { Injectable } from '@angular/core';
import { Stats } from '../enums/stats.enums';
import { weaponSkills } from '../enums/weapon-skills.enums';
import { IApiRace, IRace, IApiBonuses } from '../interfaces/race';

@Injectable({ providedIn: 'root' })
export class BuildHelper {
  constructor() {}

  public bonusAssigner(apiRace: IApiRace, raceTemplate: IRace): IRace {
    let race = { ...raceTemplate };

    race.stats = {
      stamina: apiRace.stats.find((stat: IApiBonuses) => stat.type === Stats.Stamina)?.value || race.stats.stamina,
      strength: apiRace.stats.find((stat: IApiBonuses) => stat.type === Stats.Strength)?.value || race.stats.strength,
      endurance: apiRace.stats.find((stat: IApiBonuses) => stat.type === Stats.Endurance)?.value || race.stats.endurance,
      initiative: apiRace.stats.find((stat: IApiBonuses) => stat.type === Stats.Initiative)?.value || race.stats.initiative,
      dodge: apiRace.stats.find((stat: IApiBonuses) => stat.type === Stats.Dodge)?.value || race.stats.dodge,
      learningCapacity: apiRace.stats.find((stat: IApiBonuses) => stat.type === Stats.LearningCapacity)?.value || race.stats.learningCapacity,
      luck: apiRace.stats.find((stat: IApiBonuses) => stat.type === Stats.Luck)?.value || race.stats.luck,
      discipline: apiRace.stats.find((stat: IApiBonuses) => stat.type === Stats.Discipline)?.value || race.stats.discipline,
    };

    race.weaponSkills = {
      axe: apiRace.weapon_skills.find((skill: IApiBonuses) => skill.type === weaponSkills.Axe)?.value || race.weaponSkills.axe,
      sword: apiRace.weapon_skills.find((skill: IApiBonuses) => skill.type === weaponSkills.Sword)?.value || race.weaponSkills.sword,
      mace: apiRace.weapon_skills.find((skill: IApiBonuses) => skill.type === weaponSkills.Mace)?.value || race.weaponSkills.mace,
      stave: apiRace.weapon_skills.find((skill: IApiBonuses) => skill.type === weaponSkills.Stave)?.value || race.weaponSkills.stave,
      shield: apiRace.weapon_skills.find((skill: IApiBonuses) => skill.type === weaponSkills.Shield)?.value || race.weaponSkills.shield,
      spear: apiRace.weapon_skills.find((skill: IApiBonuses) => skill.type === weaponSkills.Spear)?.value || race.weaponSkills.spear,
      chain: apiRace.weapon_skills.find((skill: IApiBonuses) => skill.type === weaponSkills.Chain)?.value || race.weaponSkills.chain,
    };

    return race;
  }
}

import { ICritChances } from "./crit-chances";
import { IStats } from "./stats";
import { IWeaponSkills } from "./weapon-skills";

export interface IRace {
    name: string;
    baseWeight: number;
    damageWithShield: number;
    critChances: ICritChances;
    stats: IStats;
    weaponSkills: IWeaponSkills;
}
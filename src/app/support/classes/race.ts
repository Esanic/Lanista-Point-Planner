import { ICritChances } from "../interfaces/crit-chances";
import { IStats } from "../interfaces/stats";
import { IWeaponSkills } from "../interfaces/weapon-skills";


export class Race {
    public name?: string;
    public baseWeight?: number;
    public damageWithShield?: number;
    public critChances?: ICritChances;
    public stats: IStats;
    public weaponSkills: IWeaponSkills;

    constructor(stats: IStats, weaponSkills: IWeaponSkills, name?: string, baseWeight?: number, damageWithShield?: number, critChances?: ICritChances, ){
        this.name = name;
        this.baseWeight = baseWeight;
        this.damageWithShield = damageWithShield;
        this.critChances = critChances
        this.stats = stats;
        this.weaponSkills = weaponSkills;
    }

    public updateWeaponSkills(weaponSkills: IWeaponSkills): void {
        this.weaponSkills = weaponSkills;
    }

    public updateStats(stats: IStats): void {
        this.stats = stats;
    }
}

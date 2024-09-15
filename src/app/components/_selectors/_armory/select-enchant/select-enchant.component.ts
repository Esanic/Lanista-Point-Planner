import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { emptyString } from '../../../../support/constants/common';
import { IEnchant } from '../../../../support/interfaces/_armory/enchants';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { CommonHelper } from '../../../../support/helpers/common.helper';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { additiveBonus, multiplierBonus } from '../../../../support/constants/templates';

@Component({
  selector: 'app-select-enchant',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-enchant.component.html',
  styleUrl: './select-enchant.component.css',
})
export class SelectEnchantComponent implements OnInit, OnDestroy {
  @Input() enchantSlot: number = 0;

  public chosenEnchant = new FormControl(emptyString);

  private selectedWeaponSkill: string = emptyString;
  private importedEnchant: IEnchant = {} as IEnchant;

  public filteredAndRenamedEnchants: IEnchant[] = [];

  private chosenEnchant$: Subscription = new Subscription();
  private selectedWeapon$: Subscription = new Subscription();
  private importedEnchant$: Subscription = new Subscription();
  private shieldBuild$: Subscription = new Subscription();
  private twoHandedBuild$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService, private commonHelper: CommonHelper) {}

  ngOnInit(): void {
    this.selectedWeapon$ = this.buildService.getChosenWeaponSkill().subscribe((weapon) => {
      this.selectedWeaponSkill = weapon;
      this.chosenEnchant.patchValue(emptyString);
      this.selectEnchantsFromWeaponSkill(this.selectedWeaponSkill);
    });

    this.shieldBuild$ = this.armoryService.listenShieldBuild().subscribe((shieldBuild) => {
      if (this.enchantSlot === 2 && shieldBuild) {
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('shield');
      } else {
        this.selectEnchantsFromWeaponSkill(this.selectedWeaponSkill);
      }
    });

    this.twoHandedBuild$ = this.armoryService.listenTwoHandedBuild().subscribe((twoHandedBuild) => {
      if (!twoHandedBuild && this.enchantSlot === 2) {
        this.chosenEnchant.patchValue(emptyString);
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenEnchant.patchValue(emptyString);
    });

    this.chosenEnchant.valueChanges.subscribe((selectedEnchant) => {
      const chosenEnchant = this.filteredAndRenamedEnchants.find((enchant) => enchant.name === selectedEnchant);

      let bonus: ITotalBonus = { additiveBonus: { ...additiveBonus }, multiplierBonus: { ...multiplierBonus } };

      //If the enchant has modifiers, apply them to bonus if they are of the type 'applicering', else apply "empty" bonus.
      if (chosenEnchant && chosenEnchant?.enchant_modifiers.length > 0) {
        chosenEnchant?.enchant_modifiers.forEach((modifier) => {
          if (modifier.proc_type_name !== 'applicering') {
            return;
          }

          switch (modifier.enchantable_name) {
            case 'Bashälsa':
              if (typeof modifier.enchant_value === 'number') {
                bonus.additiveBonus.stamina += modifier.enchant_value;
              }
              if (typeof modifier.enchant_value === 'string') {
                bonus.multiplierBonus.stamina += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
              }
              break;
            case 'Undvika Anfall':
              if (typeof modifier.enchant_value === 'number') {
                bonus.additiveBonus.dodge += modifier.enchant_value;
              }
              if (typeof modifier.enchant_value === 'string') {
                bonus.multiplierBonus.dodge += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
              }
              break;
            case 'Styrka':
              if (typeof modifier.enchant_value === 'number') {
                bonus.additiveBonus.strength += modifier.enchant_value;
              }
              if (typeof modifier.enchant_value === 'string') {
                bonus.multiplierBonus.strength += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
              }
              break;
            case 'Uthållighet':
              if (typeof modifier.enchant_value === 'number') {
                bonus.additiveBonus.endurance += modifier.enchant_value;
              }
              if (typeof modifier.enchant_value === 'string') {
                bonus.multiplierBonus.endurance += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
              }
              break;
            case 'Initiativstyrka':
              if (typeof modifier.enchant_value === 'number') {
                bonus.additiveBonus.initiative += modifier.enchant_value;
              }
              if (typeof modifier.enchant_value === 'string') {
                bonus.multiplierBonus.initiative += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
              }
              break;
            case 'vapenfärdigheten yxor':
              if (this.selectedWeaponSkill === 'Yxa') {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
            case 'vapenfärdigheten hammare':
              if (this.selectedWeaponSkill === 'Hammare') {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
            case 'vapenfärdigheten stavar':
              if (this.selectedWeaponSkill === 'Stav') {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
            case 'vapenfärdigheten stickvapen':
              if (this.selectedWeaponSkill === 'Stick') {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
            case 'vapenfärdigheten kättingvapen':
              if (this.selectedWeaponSkill === 'Kätting') {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
          }
        });
      }

      this.addEnchantBonusesToArmory(bonus);

      this.armoryService.emitBonusesHaveBeenAdded();
    });
  }

  ngOnDestroy(): void {
    this.selectedWeapon$.unsubscribe();
    this.importedEnchant$.unsubscribe();
    this.shieldBuild$.unsubscribe();
    this.twoHandedBuild$.unsubscribe();
    this.wipeBonus$.unsubscribe();
    this.chosenEnchant$.unsubscribe();
  }

  private selectEnchantsFromWeaponSkill(weaponSkill: string): void {
    switch (weaponSkill) {
      case 'Svärd':
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('sword');
        break;
      case 'Yxa':
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('axe');
        break;
      case 'Hammare':
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('mace');
        break;
      case 'Stav':
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('stave');
        break;
      case 'Stick':
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('spear');
        break;
      case 'Kätting':
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('chain');
        break;
    }
  }

  private filterAndRenameEnchants(weaponTag: string): IEnchant[] {
    const enchants = this.commonHelper.deepCopy(this.armoryService.enchants);

    let filteredEnchants: IEnchant[] = [];

    filteredEnchants = enchants.filter((enchant: IEnchant) => {
      return enchant.enchant_tags.some((tag) => {
        return tag.default_weapon_types.includes(weaponTag);
      });
    });

    const renamedEnchants: IEnchant[] = filteredEnchants.map((enchant: IEnchant) => {
      enchant.name = `${enchant.name} (G${enchant.required_level})`;
      return enchant;
    });

    return renamedEnchants.sort((a, b) => a.required_level - b.required_level);
  }

  private addEnchantBonusesToArmory(bonus: ITotalBonus): void {
    switch (this.enchantSlot) {
      case 1:
        this.armoryService.addBonus('enchantOne', bonus);
        break;
      case 2:
        this.armoryService.addBonus('enchantTwo', bonus);
        break;
      default:
        break;
    }
  }

  private addMultiplierBonusesFromModifiers(value: string): number {
    let multiplierBonus = Number(value.split('%')[0]);

    return multiplierBonus / 100;
  }
}

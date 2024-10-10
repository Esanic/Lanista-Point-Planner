import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { emptyString } from '../../../../support/constants/common';
import { IEnchant } from '../../../../support/interfaces/_armory/enchants';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { additiveBonus, enchantTemplate, multiplierBonus } from '../../../../support/constants/templates';
import { weaponSkills } from '../../../../support/enums/weapon-skills.enums';
import { deepCopy } from '../../../../support/helpers/common.helper';

@Component({
  selector: 'app-select-enchant',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-enchant.component.html',
  styleUrl: './select-enchant.component.css',
})
export class SelectEnchantComponent implements OnInit, OnDestroy {
  @Input() enchantSlot: number = 0;

  public chosenEnchant = new FormControl({ value: emptyString, disabled: true });

  private selectedWeaponSkill: number = -1;

  public filteredAndRenamedEnchants: IEnchant[] = [];

  private chosenWeaponSkill$: Subscription = new Subscription();
  private shieldBuild$: Subscription = new Subscription();
  private twoHandedBuild$: Subscription = new Subscription();
  private chosenEnchant$: Subscription = new Subscription();
  private incomingEnchant$: Subscription = new Subscription();
  private importedEnchant$: Subscription = new Subscription();
  private wipeBonus$: Subscription = new Subscription();

  constructor(private buildService: BuildService, private armoryService: ArmoryService) {}

  ngOnInit(): void {
    this.chosenWeaponSkill$ = this.buildService.getChosenWeaponSkill().subscribe((weaponSkill) => {
      if (weaponSkill !== -1) {
        this.selectedWeaponSkill = weaponSkill;
        this.chosenEnchant.enable();
        this.chosenEnchant.patchValue(emptyString);
        this.selectEnchantsFromWeaponSkill(this.selectedWeaponSkill);
      }
    });

    this.shieldBuild$ = this.armoryService.getShieldBuild().subscribe((shieldBuild) => {
      if (this.enchantSlot === 2 && shieldBuild) {
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('shield');
      } else {
        this.selectEnchantsFromWeaponSkill(this.selectedWeaponSkill);
      }
    });

    this.twoHandedBuild$ = this.armoryService.getTwoHandedBuild().subscribe((twoHandedBuild) => {
      if (!twoHandedBuild && this.enchantSlot === 2) {
        this.chosenEnchant.patchValue(emptyString);
        this.armoryService.setGear('enchantTwo', enchantTemplate);
      }
    });

    this.chosenEnchant$ = this.chosenEnchant.valueChanges.subscribe((selectedEnchant) => {
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
              if (this.selectedWeaponSkill === weaponSkills.Axe) {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
            case 'vapenfärdigheten hammare':
              if (this.selectedWeaponSkill === weaponSkills.Mace) {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
            case 'vapenfärdigheten stavar':
              if (this.selectedWeaponSkill === weaponSkills.Stave) {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
            case 'vapenfärdigheten stickvapen':
              if (this.selectedWeaponSkill === weaponSkills.Spear) {
                if (typeof modifier.enchant_value === 'number') {
                  bonus.additiveBonus.weaponSkill += modifier.enchant_value;
                }
                if (typeof modifier.enchant_value === 'string') {
                  bonus.multiplierBonus.weaponSkill += this.addMultiplierBonusesFromModifiers(modifier.enchant_value);
                }
              }
              break;
            case 'vapenfärdigheten kättingvapen':
              if (this.selectedWeaponSkill === weaponSkills.Chain) {
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
      if (chosenEnchant) {
        if (this.enchantSlot === 1) {
          this.armoryService.setGear('enchantOne', chosenEnchant);
        } else {
          this.armoryService.setGear('enchantTwo', chosenEnchant);
        }
      }

      this.armoryService.emitBonusesHaveBeenAdded();
    });

    this.incomingEnchant$ = this.armoryService.getGear().subscribe((gear) => {
      switch (this.enchantSlot) {
        case 1:
          const enchantOne = this.filteredAndRenamedEnchants.find((enchant) => enchant.name === gear.enchantOne.name);
          if (enchantOne) this.chosenEnchant.patchValue(enchantOne.name, { emitEvent: false });
          break;
        case 2:
          const enchantTwo = this.filteredAndRenamedEnchants.find((enchant) => enchant.name === gear.enchantTwo.name);
          if (enchantTwo) this.chosenEnchant.patchValue(enchantTwo.name, { emitEvent: false });
          break;
      }
    });

    this.importedEnchant$ = this.armoryService.getImportedGear().subscribe((gear) => {
      switch (this.enchantSlot) {
        case 1:
          const enchantOne = this.filteredAndRenamedEnchants.find((enchant) => enchant.name.split('(')[0].trimEnd() === gear.enchantOne);
          this.handleImportedEnchant(enchantOne, 'enchantOne');
          break;
        case 2:
          const enchantTwo = this.filteredAndRenamedEnchants.find((enchant) => enchant.name.split('(')[0].trimEnd() === gear.enchantTwo);
          this.handleImportedEnchant(enchantTwo, 'enchantTwo');
          break;
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenEnchant.patchValue(emptyString);
      switch (this.enchantSlot) {
        case 1:
          this.armoryService.setGear('enchantOne', enchantTemplate);
          break;
        case 2:
          this.armoryService.setGear('enchantTwo', enchantTemplate);
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.chosenWeaponSkill$.unsubscribe();
    this.shieldBuild$.unsubscribe();
    this.twoHandedBuild$.unsubscribe();
    this.chosenEnchant$.unsubscribe();
    this.incomingEnchant$.unsubscribe();
    this.importedEnchant$.unsubscribe();
    this.wipeBonus$.unsubscribe();
  }

  private selectEnchantsFromWeaponSkill(weaponSkill: number): void {
    switch (weaponSkill) {
      case weaponSkills.Axe:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('sword');
        break;
      case weaponSkills.Sword:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('axe');
        break;
      case weaponSkills.Mace:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('mace');
        break;
      case weaponSkills.Stave:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('stave');
        break;
      case weaponSkills.Spear:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('spear');
        break;
      case weaponSkills.Chain:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants('chain');
        break;
    }
  }

  private filterAndRenameEnchants(weaponTag: string): IEnchant[] {
    const enchants = deepCopy(this.armoryService.enchants);

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

  /** Helper function to handle the imported enchants
   *
   * @param enchant - The imported enchant
   * @param gearSlot - The gear slot to set the enchant to
   */
  private handleImportedEnchant(enchant: IEnchant | undefined, gearSlot: string): void {
    if (enchant) {
      this.chosenEnchant.patchValue(enchant.name);
      this.armoryService.setGear(gearSlot, enchant);
    } else {
      this.chosenEnchant.patchValue(emptyString);
      this.armoryService.setGear(gearSlot, enchantTemplate);
    }
  }
}

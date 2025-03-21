import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { emptyString } from '../../../../support/constants/common';
import { IEnchant, IEnchantTag } from '../../../../support/interfaces/_armory/enchants';
import { ArmoryService } from '../../../../support/services/armory.service';
import { BuildService } from '../../../../support/services/build.service';
import { ITotalBonus } from '../../../../support/interfaces/_armory/bonus';
import { additiveBonus, enchantTemplate, multiplierBonus } from '../../../../support/constants/templates';
import { weaponSkills } from '../../../../support/enums/weapon-skills.enums';
import { deepCopy } from '../../../../support/helpers/common.helper';
import { IWeapon } from '../../../../support/interfaces/_armory/weapon';

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
  private mainhand: IWeapon = {} as IWeapon;
  private offhand: IWeapon = {} as IWeapon;

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
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants([], 'shield');
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
      if (selectedEnchant === emptyString) return;

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
            case 'Undvika anfall':
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
        switch (this.enchantSlot) {
          case 1:
            this.armoryService.setGear('enchantOne', chosenEnchant);
            break;
          case 2:
            this.armoryService.setGear('enchantTwo', chosenEnchant);
            break;
          case 3:
            this.armoryService.setGear('distanceWeapon', chosenEnchant);
            break;
          default:
            break;
        }
      }

      this.armoryService.emitBonusesHaveBeenAdded();
    });

    this.incomingEnchant$ = this.armoryService.getGear().subscribe((gear) => {
      if (gear.mainhand.name !== emptyString && this.enchantSlot === 1) {
        this.mainhand = gear.mainhand;
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants(this.mainhand.enchant_tags, this.mainhand.type_name);
      }

      if (gear.mainhand.name !== emptyString && this.enchantSlot === 2 && gear.mainhand.is_two_handed) {
        this.mainhand = gear.mainhand;
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants(this.mainhand.enchant_tags, this.mainhand.type_name);
      }

      if (gear.offhand.name !== emptyString && this.enchantSlot === 2 && !gear.mainhand.is_two_handed) {
        this.offhand = gear.offhand;
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants(this.offhand.enchant_tags, this.offhand.type_name);
      }

      switch (this.enchantSlot) {
        case 1:
          const enchantOne = this.filteredAndRenamedEnchants.find((enchant) => enchant.name === gear.enchantOne.name);
          if (enchantOne) this.chosenEnchant.patchValue(enchantOne.name, { emitEvent: false });
          if (gear.enchantOne === enchantTemplate) this.chosenEnchant.patchValue(emptyString, { emitEvent: false });
          break;
        case 2:
          const enchantTwo = this.filteredAndRenamedEnchants.find((enchant) => enchant.name === gear.enchantTwo.name);
          if (enchantTwo) this.chosenEnchant.patchValue(enchantTwo.name, { emitEvent: false });
          if (gear.enchantTwo === enchantTemplate) this.chosenEnchant.patchValue(emptyString, { emitEvent: false });
          break;
        case 3:
          // Distansförstärkningar
          const enchantThree = this.filteredAndRenamedEnchants.find((enchant) => enchant.name === gear.distanceWeapon.name);
          if (enchantThree) this.chosenEnchant.patchValue(enchantThree.name, { emitEvent: false });
          if (gear.distanceWeapon === enchantTemplate) this.chosenEnchant.patchValue(emptyString, { emitEvent: false });
      }
    });

    this.importedEnchant$ = this.armoryService.getImportedGear().subscribe((gearNames) => {
      if (Object.keys(gearNames).length === 0) return;

      switch (this.enchantSlot) {
        case 1:
          const enchantOne = this.filteredAndRenamedEnchants.find((enchant) => enchant.name.split('(')[0].trimEnd() === gearNames.enchantOne);
          this.handleImportedEnchant(enchantOne, 'enchantOne');
          break;
        case 2:
          const enchantTwo = this.filteredAndRenamedEnchants.find((enchant) => enchant.name.split('(')[0].trimEnd() === gearNames.enchantTwo);
          this.handleImportedEnchant(enchantTwo, 'enchantTwo');
          break;
        case 3:
          // Distansförstärkningar
          const enchantThree = this.filteredAndRenamedEnchants.find((enchant) => enchant.name.split('(')[0].trimEnd() === gearNames.distanceWeapon);
          this.handleImportedEnchant(enchantThree, 'distanceWeapon');
          break;
      }
    });

    this.wipeBonus$ = this.buildService.listenWipeData().subscribe(() => {
      this.chosenEnchant.patchValue(emptyString);
      this.resetBonus();
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
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants([], 'sword');
        break;
      case weaponSkills.Sword:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants([], 'axe');
        break;
      case weaponSkills.Mace:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants([], 'mace');
        break;
      case weaponSkills.Stave:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants([], 'stave');
        break;
      case weaponSkills.Spear:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants([], 'spear');
        break;
      case weaponSkills.Chain:
        this.filteredAndRenamedEnchants = this.filterAndRenameEnchants([], 'chain');
        break;
    }
  }

  private filterAndRenameEnchants(enchantTags: IEnchantTag[], weaponTag?: string): IEnchant[] {
    const enchants = deepCopy(this.armoryService.enchants);

    let filteredEnchants: IEnchant[] = [];

    if (enchantTags.length === 0 && weaponTag) {
      filteredEnchants = enchants.filter((enchant: IEnchant) => {
        return enchant.enchant_tags.some((tag) => {
          return tag.default_weapon_types.includes(weaponTag);
        });
      });
    } else {
      if (this.enchantSlot === 1 || this.enchantSlot === 2) {
        filteredEnchants = enchants.filter((enchant: IEnchant) => {
          return enchant.enchant_tags.some((tag) => {
            return enchantTags.some((enchantTag) => {
              return enchantTag.name === tag.name;
            });
          });
        });
      }
    }

    // Remove enchants with the tag 'Distansförstärkningar'

    if (this.enchantSlot === 3) {
      filteredEnchants = enchants.filter((enchant: IEnchant) => {
        return enchant.enchant_tags.some((tag) => {
          return tag.name === 'Distansförstärkningar';
        });
      });
    }

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
      case 3:
        this.armoryService.addBonus('distanceWeapon', bonus);
        break;
      default:
        break;
    }
  }

  private resetBonus(): void {
    switch (this.enchantSlot) {
      case 1:
        this.armoryService.setGear('enchantOne', enchantTemplate);
        this.armoryService.addBonus('enchantOne', { additiveBonus: { ...additiveBonus }, multiplierBonus: { ...multiplierBonus } });
        break;
      case 2:
        this.armoryService.setGear('enchantTwo', enchantTemplate);
        this.armoryService.addBonus('enchantTwo', { additiveBonus: { ...additiveBonus }, multiplierBonus: { ...multiplierBonus } });
        break;
      case 3:
        this.armoryService.setGear('distanceWeapon', enchantTemplate);
        this.armoryService.addBonus('distanceWeapon', { additiveBonus: { ...additiveBonus }, multiplierBonus: { ...multiplierBonus } });
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

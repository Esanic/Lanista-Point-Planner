import { IEquipmentBonus } from './bonus';

export interface IEquipment {
  id: number;
  name: string;
  type?: number;
  bonuses: IEquipmentBonus[];
  max_level: number;
  required_level: number;
  requires_legend?: boolean;
  requirements: IRequirements[];
  weight: number;
}

export interface IRequirements {
  achievements: string[];
  age: number[]; //0 = young, 1 = adult, 2 = middle-aged, 3 = old, 4 = ancient
  id: number;
  requirementable_id: number; //Race id
  requirementable: string; //Tells what the requirement is for. Either "App\\Models\\Race" or "App\\Models\\Stat"
  requirement_value: number; //Used for stat requirements
}

import { IMinMax, IMinMaxUnits } from "./minMax";

export interface ISubstanceClass {
  chemical: string[] | null;
  psychoactive: string[] | null;
}

export interface ISubstanceTolerance {
  zero?: string | null;
  half?: string | null;
  full?: string | null;
}

export interface ISubstanceRoaDosage {
  dosage?: string | null;
  units?: string | null;
  threshold?: IMinMax | number | null;
  light?: IMinMax | number | null;
  common?: IMinMax | number | null;
  strong?: IMinMax | null;
  heavy?: number | null;
}

export interface ISubstanceRoaDuration {
  onset: IMinMaxUnits | null;
  comeup: IMinMaxUnits | null;
  peak: IMinMaxUnits | null;
  offset: IMinMaxUnits | null;
  afterglow: IMinMaxUnits | null;
  total: IMinMaxUnits | null;
}

export interface ISubstanceRoa {
  name: string;
  dose: ISubstanceRoaDosage | null;
  duration: ISubstanceRoaDuration | null;
}

export interface ISubstance {
  name: string;
  url: string;
  tolerance: ISubstanceTolerance | null;
  roas: ISubstanceRoa[];
  class: ISubstanceClass | null;
  addictionPotential: string | null;
}
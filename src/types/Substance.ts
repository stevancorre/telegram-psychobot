import { MinMax, MinMaxUnits } from "./MinMax";

export interface SubstanceClass {
  chemical: string[] | null;
  psychoactive: string[] | null;
}

export interface SubstanceTolerance {
  zero?: string | null;
  half?: string | null;
  full?: string | null;
}

export interface SubstanceRoaDosage {
  dosage?: string | null;
  units?: string | null;
  threshold?: MinMax | number | null;
  light?: MinMax | number | null;
  common?: MinMax | number | null;
  strong?: MinMax | null;
  heavy?: number | null;
}

export interface SubstanceRoaDuration {
  onset: MinMaxUnits | null;
  comeup: MinMaxUnits | null;
  peak: MinMaxUnits | null;
  offset: MinMaxUnits | null;
  afterglow: MinMaxUnits | null;
  total: MinMaxUnits | null;
}

export interface SubstanceRoa {
  name: string;
  dose: SubstanceRoaDosage | null;
  duration: SubstanceRoaDuration | null;
}

export interface Substance {
  name: string;
  url: string;
  tolerance: SubstanceTolerance | null;
  roas: SubstanceRoa[];
  class: SubstanceClass | null;
  addictionPotential: string | null;
}
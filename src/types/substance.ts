import { IMinMax, IMinMaxUnits } from "./minMax";

/**
 * Interface for a substance class
 */
//! Unused
export interface ISubstanceClass {
  /**
   * Chemical class of the substance
   */
  chemical: string[] | null;

  /**
   * Psychoactive class of the substance
   */
  psychoactive: string[] | null;
}

/**
 * Interface to represent the tolerance associated to a substance 
 */
export interface ISubstanceTolerance {
  /**
   * For how long you'll have a full tolerance
   */
  full?: string | null;

  /**
   * How long it takes to reduce by half your tolerance
   */
  half?: string | null;

  /**
   * How long it takes to reach 0 tolerance
   */
  zero?: string | null;
}

/**
 * Interface to represent dosage for a specific ROA for a substance (yaeh)
 */
export interface ISubstanceRoaDosage {
  /**
   * Dosage
   */
  dosage?: string | null;

  /**
   * Units
   */
  units?: string | null;

  /**
   * Threshold dosage
   */
  threshold?: IMinMax | number | null;

  /**
   * Light dosage
   */
  light?: IMinMax | number | null;

  /**
   * Common dosage
   */
  common?: IMinMax | number | null;

  /**
   * Strong dosage
   */
  strong?: IMinMax | null;
  
  /**
   * Heavy dosage
   */
  heavy?: number | null;
}

/**
 * Interface to represent duration for a specific ROA for a substance (yaeh again)
 */
export interface ISubstanceRoaDuration {
  /**
   * Onset duration
   */
  onset: IMinMaxUnits | null;

  /**
   * Comeup duration
   */
  comeup: IMinMaxUnits | null;

  /**
   * Peak duration
   */
  peak: IMinMaxUnits | null;

  /**
   * Offset duration
   */
  offset: IMinMaxUnits | null;

  /**
   * Afterglow duration
   */
  afterglow: IMinMaxUnits | null;

  /**
   * Total duration
   */
  total: IMinMaxUnits | null;
}

/**
 * Interface to represent a ROA (Route Of Administration) for a substance
 */
export interface ISubstanceRoa {
  /**
   * The roa name
   */
  name: string;

  /**
   * The dosages
   */
  dose: ISubstanceRoaDosage | null;

  /**
   * The durations
   */
  duration: ISubstanceRoaDuration | null;
}

/**
 * Interface to represent a substance
 */
export interface ISubstance {
  /**
   * The name of the substance
   */
  name: string;

  /**
   * The PsychonautWiki url associated to the substance
   */
  url: string;

  /**
   * The tolerance associated to the substance
   */
  tolerance: ISubstanceTolerance | null;

  /**
   * ROAs of the substance
   */
  roas: ISubstanceRoa[];

  /**
   * The class of the substance
   */
  class: ISubstanceClass | null;

  /**
   * The addiction potential associated to the substance
   */
  addictionPotential: string | null;
}
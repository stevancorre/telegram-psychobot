/**
 * Interface for a range
 */
export interface IMinMax {
  /**
   * Min value
   */
  min: number | null;

  /**
   * Max value
   */
  max: number | null;
}

/**
 * Interface for a range with units
 */
export interface IMinMaxUnits extends IMinMax {
  /**
   * The values' units
   */
  units: string | null;
}
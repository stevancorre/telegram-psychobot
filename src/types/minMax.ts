export interface IMinMax {
  min: number | null;
  max: number | null;
}

export interface IMinMaxUnits extends IMinMax {
  units: string | null;
}
import { gql } from 'graphql-request'
import { ISubstance } from '../types/ISubstance';

export interface PwInfoResponse {
  substances: ISubstance[];
};

export function getPwInfoQuery(substanceName: string): string {
  return gql`{
    substances(query: "${substanceName}") {
    name
    url
    addictionPotential
    class {
      chemical
      psychoactive
    }
    tolerance {
      full
      half
      zero
    }
    # routes of administration
    roas {
      name
      dose {
        units
        threshold
        heavy
        common { min max }
        light { min max }
        strong { min max }
      }
      duration {
        afterglow { min max units }
        comeup { min max units }
        duration { min max units }
        offset { min max units }
        onset { min max units }
        peak { min max units }
        total { min max units }
      }
      bioavailability {
        min max
      }
    }
  }
}`;
}
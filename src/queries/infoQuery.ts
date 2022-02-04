/**
 * Builds the GraphQL query for a specific substance name
 * 
 * @param substanceName The target substance name. It has be formatted first (e.g no alias)
 * 
 * @returns The corresponding GraphQL query
 */
export function getPwInfoQuery(substanceName: string): string {
  return `{
    substances(query: "${substanceName}") {
      name
      url
      addictionPotential
      tolerance {
        full
        half
        zero
      }
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
      }
    }
  }`;
}
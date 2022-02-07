export function getPwEffectsQuery(substanceName: string): string {
  return `{
        substances(query: "${substanceName}") {
          name
          effects {
            name
            url
          }
        }
      }`;
}
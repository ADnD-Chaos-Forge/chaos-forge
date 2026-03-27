/**
 * Convert pounds (lbs) to kilograms for display purposes.
 * DB values remain in imperial (lbs).
 */
export function lbsToKg(lbs: number): string {
  return (lbs * 0.453592).toFixed(1);
}

/**
 * Convert feet to meters for display purposes.
 */
export function feetToMeters(feet: number): string {
  return (feet * 0.3048).toFixed(1);
}

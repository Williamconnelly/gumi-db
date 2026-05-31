/** Build a FuzzyDateInt from a year and two-digit month argument.
 * 
 * (e.g. year=1999, month=3 → 19990300)
 */
export function fuzzyDate(year: number, month: number): number {
  return year * 10000 + month * 100;
}
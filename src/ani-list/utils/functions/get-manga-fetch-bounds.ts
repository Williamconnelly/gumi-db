import { fuzzyDate } from '../../../common';
import { IDateFetchBounds } from '../interfaces';

const SEASON_QUARTERS: [number, number][] = [
  [0, 3],
  [4, 6],
  [7, 9],
  [10, 99],
];

export function getMangaFetchBounds(year: number): IDateFetchBounds[] {
  return SEASON_QUARTERS.map(([start, end]) => ({
    dateGreater: fuzzyDate(year, start),
    dateLesser: fuzzyDate(year, end),
  }));
}
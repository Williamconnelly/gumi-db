import { fuzzyDate } from '../../../common';
import { IDateFetchBounds } from '../interfaces';

const SEASON_QUARTERS: [number, number][] = [
  [0, 3],
  [3, 6],
  [6, 9],
  [9, 99],
];

export function getMangaFetchBounds(year: number): IDateFetchBounds[] {
  return SEASON_QUARTERS.map(([start, end]: [number, number], index: number) => {
    let dateGreater: number;

    if (index === 0)
      dateGreater = fuzzyDate(year - 1, 99, 99);
    else
      dateGreater = fuzzyDate(year, start, 99);

    return {
      dateGreater,
      dateLesser: fuzzyDate(year, end, 99),
    }
  });
}
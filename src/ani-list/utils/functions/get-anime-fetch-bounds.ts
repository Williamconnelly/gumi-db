import { fuzzyDate } from '../../../common';
import { IDateFetchBounds } from '../interfaces';

export function getAnimeFetchBounds(year: number): IDateFetchBounds {
  return {
    dateGreater: fuzzyDate(year - 1, 99, 99),
    dateLesser: fuzzyDate(year, 99, 99),
  };
}
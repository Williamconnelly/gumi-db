import { fuzzyDate } from '../../../common';
import { IDateFetchBounds } from '../interfaces';

export function getAnimeFetchBounds(year: number): IDateFetchBounds {
  return {
    dateGreater: fuzzyDate(year, 0),
    dateLesser: fuzzyDate(year, 99),
  };
}
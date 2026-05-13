import { pgEnum } from 'drizzle-orm/pg-core';

export const mediaSeasonEnum = pgEnum('media_season', [
  'WINTER',
  'SPRING',
  'SUMMER',
  'FALL',
]);
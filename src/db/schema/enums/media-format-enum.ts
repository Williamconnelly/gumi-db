import { pgEnum } from 'drizzle-orm/pg-core';

export const mediaFormatEnum = pgEnum('media_format', [
  'TV',
  'TV_SHORT',
  'MOVIE',
  'SPECIAL',
  'OVA',
  'ONA',
  'MUSIC',
  'MANGA',
  'NOVEL',
  'ONE_SHOT',
]);
import { pgEnum } from 'drizzle-orm/pg-core';

// ── Enums ────────────────────────────────────────────────
export const MEDIA_FORMAT = pgEnum('media_format', [
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

export const MEDIA_STATUS = pgEnum('media_status', [
  'FINISHED',
  'RELEASING',
  'NOT_YET_RELEASED',
  'CANCELLED',
  'HIATUS'
]);

export const MEDIA_SEASON = pgEnum('media_season', [
  'WINTER',
  'SPRING',
  'SUMMER',
  'FALL'
]);

export const MEDIA_LIST_STATUS = pgEnum('media_list_status', [
  'CURRENT',
  'PLANNING',
  'COMPLETED',
  'DROPPED',
  'PAUSED',
  'REPEATING',
]);

// ── Media ─────────────────────────────────────────────────


import { pgEnum } from 'drizzle-orm/pg-core';

export const mediaStatusEnum = pgEnum('media_status', [
  'FINISHED',
  'RELEASING',
  'NOT_YET_RELEASED',
  'CANCELLED',
  'HIATUS',
]);
import { pgEnum } from 'drizzle-orm/pg-core';

export const characterRoleEnum = pgEnum('character_role', [
  'MAIN',
  'SUPPORTING',
  'BACKGROUND',
]);
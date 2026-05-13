import { pgEnum } from 'drizzle-orm/pg-core';

export const mediaRelationTypeEnum = pgEnum('media_relation_type', [
  'ADAPTATION',
  'PREQUEL',
  'SEQUEL',
  'PARENT',
  'SIDE_STORY',
  'CHARACTER',
  'SUMMARY',
  'ALTERNATIVE',
  'SPIN_OFF',
  'OTHER',
  'SOURCE',
  'COMPILATION',
  'CONTAINS',
]);
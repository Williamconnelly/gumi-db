import { index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { characters, media } from '../../schema';
import { characterRoleEnum } from '../enums';

export const mediaCharactersTable = pgTable('media_characters',
  {
    mediaId: integer('media_id').notNull().references(() => media.id, { onDelete: 'cascade' }),
    characterId: integer('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
    role: characterRoleEnum('role'),
  },
  (t) => [
    primaryKey({ columns: [t.mediaId, t.characterId] }),
    index('media_characters_media_idx').on(t.mediaId),
  ]
);
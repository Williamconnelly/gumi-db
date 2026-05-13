import { index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { characterRoleEnum } from '../enums';
import { charactersTable, mediaTable } from '../tables';

export const mediaCharactersTable = pgTable('media_characters',
  {
    mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
    characterId: integer('character_id').notNull().references(() => charactersTable.id, { onDelete: 'cascade' }),
    role: characterRoleEnum('role'),
  },
  (t) => [
    primaryKey({ columns: [t.mediaId, t.characterId] }),
    index('media_characters_media_idx').on(t.mediaId),
  ]
);
import { index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { characterRoleEnum } from '../enums';
import { charactersTable, mediaTable, staffTable } from '../tables';

export const mediaCharactersTable = pgTable('media_characters',
  {
    mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
    characterId: integer('character_id').notNull().references(() => charactersTable.id, { onDelete: 'cascade' }),
    /** The characters role in the media */
    role: characterRoleEnum('role'),
    /** The voice actors of the character */
    voiceActorId: integer('voice_actor_id').references(() => staffTable.id, { onDelete: 'set null' }),
  },
  (t) => [
    primaryKey({ columns: [t.mediaId, t.characterId] }),
    index('media_characters_media_idx').on(t.mediaId),
    index('media_characters_character_idx').on(t.characterId),
    index('media_characters_va_idx').on(t.voiceActorId),
  ]
);

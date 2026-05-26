import { boolean, index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { mediaTable, studiosTable } from '../tables';

export const mediaStudiosTable = pgTable('media_studios',
  {
    mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
    studioId: integer('studio_id').notNull().references(() => studiosTable.id, { onDelete: 'cascade' }),
    /** Whether this is the primary animation studio for the media */
    isMain: boolean('is_main').default(false).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.mediaId, t.studioId] }),
    index('media_studios_media_idx').on(t.mediaId),
    index('media_studios_studio_idx').on(t.studioId),
  ]
);

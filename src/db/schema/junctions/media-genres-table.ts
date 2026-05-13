import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { genresTable, mediaTable } from '../tables';

export const mediaGenresTable = pgTable('media_genres', {
  mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
  genreName: text('genre_name').notNull().references(() => genresTable.name, { onDelete: 'cascade' }),
},
  (t) => [
    primaryKey({ columns: [t.mediaId, t.genreName] }),
  ]
);
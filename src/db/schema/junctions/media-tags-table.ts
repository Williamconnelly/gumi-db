import { boolean, index, integer, pgTable, primaryKey, smallint } from 'drizzle-orm/pg-core';
import { mediaTable, tagsTable } from '../tables';

export const mediaTagsTable = pgTable('media_tags',
  {
    mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id').notNull().references(() => tagsTable.id, { onDelete: 'cascade' }),
    /** Whether the tag is a spoiler for the media */
    isSpoiler: boolean('is_spoiler').default(false).notNull(),
    /** Percentage of users who have voted for the tag */
    rank: smallint('rank'),
  },
  (t) => [
    primaryKey({ columns: [t.mediaId, t.tagId] }),
    index('media_tags_media_idx').on(t.mediaId),
    index('media_tags_tag_idx').on(t.tagId),
  ]
);

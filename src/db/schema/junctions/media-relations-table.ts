import { index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { mediaRelationTypeEnum } from '../enums';
import { mediaTable } from '../tables';

export const mediaRelationsTable = pgTable('media_relations',
  {
    mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
    relatedMediaId: integer('related_media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
    /** How the media is related */
    relationType: mediaRelationTypeEnum('relation_type').notNull(),
  },
  (t) => [
    // relationType is part of the PK because two media entries can have
    // more than one relation type between them (rare but possible on AniList)
    primaryKey({ columns: [t.mediaId, t.relatedMediaId, t.relationType] }),
    index('media_relations_media_idx').on(t.mediaId),
    index('media_relations_related_idx').on(t.relatedMediaId),
  ]
);
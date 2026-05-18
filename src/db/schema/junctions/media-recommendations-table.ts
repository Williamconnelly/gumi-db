import { index, integer, pgTable } from 'drizzle-orm/pg-core';
import { mediaTable } from '../tables';


export const mediaRecommendationsTable = pgTable('media_recommendations', {
  /** The AniList id of the recommendation itself */
  id: integer('id').primaryKey(),
  /** The source media */
  mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
  /** The recommended media */
  recommendedMediaId: integer('recommended_media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
  /** Net user rating of the recommendation */
  rating: integer('rating'),
},
  (t) => [
    index('media_recommendations_media_idx').on(t.mediaId),
    index('media_recommendations_recommended_idx').on(t.recommendedMediaId),
  ]
);
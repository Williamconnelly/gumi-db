import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const tagsTable = pgTable('tags', {
  /** The id of the tag */
  id: integer('id').primaryKey(),
  /** The name of the tag */
  name: text('name').notNull(),
  /** A general description of the tag */
  description: text('description'),
  /** The categories of tags this tag belongs to */
  category: text('category'),
  /** If the tag is for adult media */
  isAdult: boolean('is_adult').default(false)
});
import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const studiosTable = pgTable('studios', {
  /** The id of the studio */
  id: integer('id').primaryKey(),
  /** The name of the studio */
  name: text('name').notNull(),
  /** If the studio is an animation studio or a different kind (e.g. music, licensor) */
  isAnimationStudio: boolean('is_animation_studio').default(false).notNull(),
  /** The number of users who have favourited the studio */
  favourites: integer('favourites'),
});
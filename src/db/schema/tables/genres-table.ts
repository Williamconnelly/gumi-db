import { pgTable, text } from 'drizzle-orm/pg-core';

export const genresTable = pgTable('genres', {
  name: text('name').primaryKey(),
});
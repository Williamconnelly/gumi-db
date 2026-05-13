import { boolean, index, integer, pgTable, smallint, text } from 'drizzle-orm/pg-core';

export const staffTable = pgTable('staff', {
  /** The id of the staff */
  id: integer('id').primaryKey(),
  /** The primary language of the staff member */
  language: text('language'),
  /** A general description of the staff member */
  description: text('description'),
  /** The staff's gender */
  gender: text('gender'),
  /** The person's age in years */
  age: integer('age'),
  /** The persons birthplace or hometown */
  homeTown: text('home_town'),
  /** The year the staff member began their career */
  yearsActiveStart: smallint('years_active_start'),
  /** The year the staff member ended their career. Null indicates still active */
  yearsActiveEnd: smallint('years_active_end'),
  /** The persons blood type */
  bloodType: text('blood_type'),
  /** If the staff member is blocked from being added to favourites - Pending deprecation, etc. */
  isFavouriteBlocked: boolean('is_favourite_blocked').default(false).notNull(),
  /** The number of users who have favourited the staff member */
  favourites: integer('favourites')
});

export const staffOccupationsTable = pgTable('staff_occupations', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  /** The id of the staff member this occupation belongs to */
  staffId: integer('staff_id').notNull().references(() => staffTable.id, { onDelete: 'cascade' }),
  /** The occupation of the staff member" */
  occupation: text('occupation').notNull(),
},
  (t) => [
    index('staff_occupations_staff_idx').on(t.staffId),
    index('staff_occupations_occupation_idx').on(t.occupation),
  ]
);


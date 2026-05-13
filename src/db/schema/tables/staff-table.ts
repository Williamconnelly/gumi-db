import { boolean, index, integer, pgTable, smallint, text } from 'drizzle-orm/pg-core';

export const staffTable = pgTable('staff', {
  /** The id of the staff member */
  id: integer('id').primaryKey(),
  /** The staff member's first and last name */
  nameFull: text('name_full'),
  /** The staff member's given name */
  nameFirst: text('name_first'),
  /** The staff member's middle name */
  nameMiddle: text('name_middle'),
  /** The staff member's surname */
  nameLast: text('name_last'),
  /** The staff member's full name in their native language */
  nameNative: text('name_native'),
  /** The primary language of the staff member */
  language: text('language'),
  /** A general description of the staff member */
  description: text('description'),
  /** The staff member's gender */
  gender: text('gender'),
  /** The person's age in years */
  age: integer('age'),
  /** The persons birthplace or hometown */
  homeTown: text('home_town'),
  /** The year the staff member was born */
  yearOfBirth: smallint('year_of_birth'),
  /** The month the staff member was born */
  monthOfBirth: smallint('month_of_birth'),
  /** The day the staff member was born */
  dayOfBirth: smallint('day_of_birth'),
  /** The year the staff member began their career */
  yearsActiveStart: smallint('years_active_start'),
  /** The year the staff member ended their career. Null indicates still active */
  yearsActiveEnd: smallint('years_active_end'),
  /** The persons blood type */
  bloodType: text('blood_type'),
  /** The staff member's image at its largest size */
  imageLarge: text('image_large'),
  /** The staff member's image at medium size */
  imageMedium: text('image_medium'),
  /** If the staff member is blocked from being added to favourites - Pending deprecation, etc.  */
  isFavouriteBlocked: boolean('is_favourite_blocked').default(false).notNull(),
  /** The number of users who have favourited the staff member */
  favourites: integer('favourites'),
});

export const staffOccupationsTable = pgTable('staff_occupations', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  /** The id of the staff member this occupation belongs to */
  staffId: integer('staff_id').notNull().references(() => staffTable.id, { onDelete: 'cascade' }),
  /** The occupation of the staff member */
  occupation: text('occupation').notNull(),
},
  (t) => [
    index('staff_occupations_staff_idx').on(t.staffId),
    index('staff_occupations_occupation_idx').on(t.occupation),
  ]
);

export const staffNamesTable = pgTable('staff_names', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  /** The id of the staff member this name belongs to */
  staffId: integer('staff_id').notNull().references(() => staffTable.id, { onDelete: 'cascade' }),
  /** An alternative name the staff member might be referred to as */
  name: text('name').notNull(),
},
  (t) => [
    index('staff_names_staff_idx').on(t.staffId),
  ]
);
import { boolean, index, integer, pgTable, smallint, text } from 'drizzle-orm/pg-core';

export const charactersTable = pgTable('characters', {
  /** The id of the character */
  id: integer('id').primaryKey(),
  /** The character's given name */
  firstName: text('first_name'),
  /** The character's middle name */
  middleName: text('middle_name'),
  /** The character's surname */
  lastName: text('last_name'),
  /** The character's first and last name */
  fullName: text('full_name'),
  /** The character's full name in their native language */
  nativeName: text('native_name'),
  /** The character's age. May contain further text and additional ages */
  age: text('age'),
  /** The character's image at its largest size */
  imageLarge: text('image_large'),
  /** The character's image at medium size */
  imageMedium: text('image_medium'),
  /** A general description of the character */
  description: text('description'),
  /** The character's gender */
  gender: text('gender'),
  /** Numeric day of birth */
  dayOfBirth: smallint('day_of_birth'),
  /** Numeric month of birth */
  monthOfBirth: smallint('month_of_birth'),
  /** Numeric year of birth */
  yearOfBirth: integer('year_of_birth'),
  /** The character's blood type */
  bloodType: text('blood_type'),
  /** The number of users who have favourited the character */
  favourites: integer('favourites'),
});

export const characterNamesTable = pgTable('character_names', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  /** The id of the character this name belongs to */
  characterId: integer('character_id').notNull().references(() => charactersTable.id, { onDelete: 'cascade' }),
  /** An alternative name the character might be referred to as */
  name: text('name').notNull(),
  /** Whether this alternative name is a spoiler */
  isSpoiler: boolean('is_spoiler').default(false).notNull(),
},
  (t) => [
    index('character_names_character_idx').on(t.characterId),
  ]
);
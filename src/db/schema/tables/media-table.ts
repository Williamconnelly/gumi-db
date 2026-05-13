import { boolean, integer, pgTable, real, smallint, text } from 'drizzle-orm/pg-core';
import { mediaFormatEnum, mediaSeasonEnum, mediaSourceEnum, mediaStatusEnum, mediaTypeEnum } from '../enums';

export const mediaTable = pgTable('media', {
  /** The id of the media */
  id: integer('id').primaryKey(),
  /** MyAnimeList Cross-reference - The MAL id of the media */
  idMal: integer('id_mal'),
  /** The romanization of the native language title */
  titleRomaji: text('title_romaji'),
  /** The official english title */
  titleEnglish: text('title_english'),
  /** Official title in it's native language */
  titleNative: text('title_native'),
  /** The type of the media */
  type: mediaTypeEnum('type'),
  /** The format the media was released in */
  format: mediaFormatEnum('format'),
  /** The current releasing status of the media */
  status: mediaStatusEnum('status'),
  /** Source type the media was adapted from */
  source: mediaSourceEnum('source'),
  /** Where the media was created - ISO 3166-1 alpha-2*/
  countryOfOrigin: text('country_of_origin'),
  /** The first release year of the media */
  startDateYear: smallint('start_date_year'),
  /** The first release month of the media */
  startDateMonth: smallint('start_date_month'),
  /** The first release month of the media */
  startDateDay: smallint('start_date_day'),
  /** The last release year of the media */
  endDateYear: smallint('end_date_year'),
  /** The last release month of the media */
  endDateMonth: smallint('end_date_month'),
  /** The last release day of the media */
  endDateDay: smallint('end_date_day'),
  /** The season the media was initially released in */
  season: mediaSeasonEnum('season'),
  /** The season year the media was initially released in */
  seasonYear: smallint('season_year'),
  /** The number of episodes when complete */
  episodes: integer('episodes'),
  /** The aproximate length of each anime episode in minutes */
  duration: integer('duration'),
  /** The number of chapters when complete */
  chapters: integer('chapters'),
  /** The number of volumes when complete */
  volumes: integer('volumes'),
  /** Short description of the media's story and characters */
  description: text('description'),
  /** A weighted average score of all user scores of the media */
  averageScore: real('average_score'),
  /** Mean score of all user scores of the media */
  meanScore: real('mean_score'),
  /** The number of users with the media on their list */
  popularity: integer('popularity'),
  /** The amount of user's who have favourited the media */
  favourites: integer('favourites'),
  /** If the media is intended for adult audiences */
  isAdult: boolean('is_adult').default(false).notNull(),
  /** If the media is officially licensed or a self-published doujin release */
  isLicensed: boolean('is_licensed').default(false).notNull(),
  /** If media cannot be added to lists or favorites - Pending deletion, etc. */
  isLocked: boolean('is_locked').default(false).notNull(),
  /** The cover image url of the media at its largest size */
  coverImageExtraLarge: text('cover_image_extra_large'),
  /** The cover image url of the media at a large size */
  coverImageLarge: text('cover_image_large'),
  /** The cover image url of the media at medium size */
  coverImageMedium: text('cover_image_medium'),
  /** When the media's data was last updated */
  updatedAt: integer('updated_at'),
});

export const mediaNamesTable = pgTable('media_names', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  /** The id of the media this name belongs to */
  mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
  /** Alternative / Synonymous name for the media */
  name: text('name').notNull(),
});

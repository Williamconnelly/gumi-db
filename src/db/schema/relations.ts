import { relations } from 'drizzle-orm';
import { mediaCharactersTable, mediaGenresTable, mediaConnectionsTable, mediaStaffTable, mediaTagsTable } from './junctions';
import { characterNamesTable, charactersTable, genresTable, mediaNamesTable, mediaTable, staffNamesTable, staffOccupationsTable, staffTable, tagsTable, } from './tables';

export const mediaRelations = relations(mediaTable, ({ many }) => ({
  names: many(mediaNamesTable),
  genres: many(mediaGenresTable),
  tags: many(mediaTagsTable),
  staff: many(mediaStaffTable),
  characters: many(mediaCharactersTable),
  relationsFrom: many(mediaConnectionsTable, { relationName: 'mediaSource' }),
  relationsTo: many(mediaConnectionsTable, { relationName: 'mediaTarget' }),
}));

/** [Media => Media Names] One-to-Many */
export const mediaNamesRelations = relations(mediaNamesTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaNamesTable.mediaId],
    references: [mediaTable.id]
  })
}));

// TODO
export const genresRelations = relations(genresTable, ({ many }) => ({
  media: many(mediaGenresTable),
}));

/** [Media => Genres] Many-to-Many */
export const mediaGenresRelations = relations(mediaGenresTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaGenresTable.mediaId],
    references: [mediaTable.id],
  }),
  genre: one(genresTable, {
    fields: [mediaGenresTable.genreName],
    references: [genresTable.name],
  }),
}));

// TODO
export const tagsRelations = relations(tagsTable, ({ many }) => ({
  media: many(mediaTagsTable),
}));

/** [Media => Tags] Many-to-Many */
export const mediaTagsRelations = relations(mediaTagsTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaTagsTable.mediaId],
    references: [mediaTable.id],
  }),
  tag: one(tagsTable, {
    fields: [mediaTagsTable.tagId],
    references: [tagsTable.id],
  }),
}));

/** [Media => Staff] Many-to-Many */
export const mediaStaffRelations = relations(mediaStaffTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaStaffTable.mediaId],
    references: [mediaTable.id],
  }),
  staff: one(staffTable, {
    fields: [mediaStaffTable.staffId],
    references: [staffTable.id],
  }),
}));

/** [Staff => Staff Names] One-to-Many */
export const staffNamesRelations = relations(staffNamesTable, ({ one }) => ({
  staff: one(staffTable, {
    fields: [staffNamesTable.staffId],
    references: [staffTable.id],
  }),
}));

/** [Staff => Staff Occupations] One-to-Many */
export const staffOccupationsRelations = relations(staffOccupationsTable, ({ one }) => ({
  staff: one(staffTable, {
    fields: [staffOccupationsTable.staffId],
    references: [staffTable.id],
  }),
}));

// TODO
export const charactersRelations = relations(charactersTable, ({ many }) => ({
  names: many(characterNamesTable),
  media: many(mediaCharactersTable),
}));

/** [Media => Characters] Many-to-Many */
export const mediaCharactersRelations = relations(mediaCharactersTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaCharactersTable.mediaId],
    references: [mediaTable.id],
  }),
  character: one(charactersTable, {
    fields: [mediaCharactersTable.characterId],
    references: [charactersTable.id],
  }),
  voiceActor: one(staffTable, {
    fields: [mediaCharactersTable.voiceActorId],
    references: [staffTable.id],
  }),
}));

/** [Staff => Characters] One-to-Many */
export const staffCharactersRelations = relations(staffTable, ({ many }) => ({
  occupations: many(staffOccupationsTable),
  media: many(mediaStaffTable),
  voicedCharacters: many(mediaCharactersTable, {
    relationName: 'voiceActor'
  }),
}));

/** [Characters => Character Names] One-to-Many */
export const characterNamesRelations = relations(characterNamesTable, ({ one }) => ({
  character: one(charactersTable, {
    fields: [characterNamesTable.characterId],
    references: [charactersTable.id],
  }),
}));

// TODO
export const mediaConnectionsRelations = relations(mediaConnectionsTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaConnectionsTable.mediaId],
    references: [mediaTable.id],
    relationName: 'mediaSource',
  }),
  relatedMedia: one(mediaTable, {
    fields: [mediaConnectionsTable.relatedMediaId],
    references: [mediaTable.id],
    relationName: 'mediaTarget',
  }),
}));








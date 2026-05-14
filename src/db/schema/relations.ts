import { relations } from 'drizzle-orm';
import { mediaCharactersTable, mediaGenresTable, mediaRelationsTable, mediaStaffTable, mediaTagsTable, } from './junctions';
import { characterNamesTable, charactersTable, genresTable, mediaNamesTable, mediaTable, staffOccupationsTable, staffTable, tagsTable, } from './tables';

// ── Media ─────────────────────────────────────────────────

export const mediaRelations = relations(mediaTable, ({ many }) => ({
  names: many(mediaNamesTable),
  genres: many(mediaGenresTable),
  tags: many(mediaTagsTable),
  staff: many(mediaStaffTable),
  characters: many(mediaCharactersTable),
  /** Relations where this media is the source (e.g. "this show has a SEQUEL") */
  relationsFrom: many(mediaRelationsTable, { relationName: 'mediaSource' }),
  /** Relations where this media is the target (e.g. "this show is a SEQUEL of something") */
  relationsTo: many(mediaRelationsTable, { relationName: 'mediaTarget' }),
}));

export const mediaNamesRelations = relations(mediaNamesTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaNamesTable.mediaId],
    references: [mediaTable.id],
  }),
}));

// ── Genres ────────────────────────────────────────────────

export const genresRelations = relations(genresTable, ({ many }) => ({
  media: many(mediaGenresTable),
}));

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

// ── Tags ──────────────────────────────────────────────────

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  media: many(mediaTagsTable),
}));

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

// ── Staff ─────────────────────────────────────────────────

export const staffRelations = relations(staffTable, ({ many }) => ({
  occupations: many(staffOccupationsTable),
  media: many(mediaStaffTable),
  /** Characters this staff member has voiced */
  voicedCharacters: many(mediaCharactersTable),
}));

export const staffOccupationsRelations = relations(staffOccupationsTable, ({ one }) => ({
  staff: one(staffTable, {
    fields: [staffOccupationsTable.staffId],
    references: [staffTable.id],
  }),
}));

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

// ── Characters ────────────────────────────────────────────

export const charactersRelations = relations(charactersTable, ({ many }) => ({
  names: many(characterNamesTable),
  media: many(mediaCharactersTable),
}));

export const characterNamesRelations = relations(characterNamesTable, ({ one }) => ({
  character: one(charactersTable, {
    fields: [characterNamesTable.characterId],
    references: [charactersTable.id],
  }),
}));

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

// ── Media Relations (self-referential) ────────────────────

export const mediaRelationsTableRelations = relations(mediaRelationsTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaRelationsTable.mediaId],
    references: [mediaTable.id],
    relationName: 'mediaSource',
  }),
  relatedMedia: one(mediaTable, {
    fields: [mediaRelationsTable.relatedMediaId],
    references: [mediaTable.id],
    relationName: 'mediaTarget',
  }),
}));
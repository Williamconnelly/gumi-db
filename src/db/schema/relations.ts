import { relations } from "drizzle-orm";
import { mediaCharactersTable, mediaGenresTable } from './junctions';
import { characterNamesTable, charactersTable, genresTable, mediaNamesTable, mediaTable } from './tables';

export const charactersRelations = relations(charactersTable, ({ many }) => ({
  media: many(mediaCharactersTable),
  names: many(characterNamesTable),
}));

export const characterNamesRelations = relations(characterNamesTable, ({ one }) => ({
  character: one(charactersTable, {
    fields: [characterNamesTable.characterId],
    references: [charactersTable.id],
  }),
}));

export const mediaNamesRelations = relations(mediaNamesTable, ({ one }) => ({
  character: one(mediaTable, {
    fields: [mediaNamesTable.mediaId],
    references: [mediaTable.id],
  }),
}));

export const genresRelations = relations(genresTable, ({ many }) => ({
  media: many(mediaGenresTable),
}));




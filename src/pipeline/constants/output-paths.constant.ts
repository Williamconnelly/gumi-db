import * as path from 'path';

const OUTPUT_DIR: string = path.resolve('output');

export const ANIME_DIR: string = path.join(OUTPUT_DIR, 'anime');
export const MANGA_DIR: string = path.join(OUTPUT_DIR, 'manga');
export const STATE_FILE: string = path.join(OUTPUT_DIR, 'state.json');
export const CHARACTER_IDS_FILE: string = path.join(OUTPUT_DIR, 'character-ids.json');
export const STAFF_IDS_FILE: string = path.join(OUTPUT_DIR, 'staff-ids.json');
export const GENRES_FILE: string = path.join(OUTPUT_DIR, 'genres.json');
export const TAGS_FILE: string = path.join(OUTPUT_DIR, 'tags.json');
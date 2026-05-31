import * as path from 'path';
import { IPipelineState } from '../interfaces';

export const OUTPUT_DIR: string = path.resolve('output');
export const ANIME_DIR: string = path.join(OUTPUT_DIR, 'anime');
export const MANGA_DIR: string = path.join(OUTPUT_DIR, 'manga');
export const STATE_FILE: string = path.join(OUTPUT_DIR, 'state.json');
export const START_YEAR = 1900;
export const FUTURE_YEAR_BUFFER: number = 5;
export const END_YEAR: number = new Date().getFullYear() + FUTURE_YEAR_BUFFER;
export const DEFAULT_STATE: IPipelineState = {
  anime: { lastCompletedYear: START_YEAR - 1 },
  manga: { lastCompletedYear: START_YEAR - 1 },
};
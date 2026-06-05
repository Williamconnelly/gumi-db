import * as fs from 'fs';
import { Lambda } from '../common';
import { Logger } from '../logging';
import { OUTPUT_PATHS } from './constants';
import { PipelineState } from './pipeline-state';

const logger: Logger = new Logger('Clear');

function clearAnime(): void {
  fs.rmSync(OUTPUT_PATHS.ANIME_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_PATHS.ANIME_DIR, { recursive: true });

  new PipelineState().resetAnime();

  logger.info('Anime output cleared and state reset', 'clearAnime');
}

function clearManga(): void {
  fs.rmSync(OUTPUT_PATHS.MANGA_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_PATHS.MANGA_DIR, { recursive: true });

  new PipelineState().resetManga();

  logger.info('Manga output cleared and state reset', 'clearManga');
}

function clearStaff(): void {
  fs.rmSync(OUTPUT_PATHS.STAFF_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_PATHS.STAFF_DIR, { recursive: true });

  new PipelineState().resetStaff();

  logger.info('Staff output cleared and state reset', 'clearStaff');
}

function clearCharacters(): void {
  fs.rmSync(OUTPUT_PATHS.CHARACTERS_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_PATHS.CHARACTERS_DIR, { recursive: true });

  new PipelineState().resetCharacters();

  logger.info('Characters output cleared and state reset', 'clearCharacters');
}

const COMMANDS: Record<string, () => void> = {
  anime: clearAnime,
  manga: clearManga,
  staff: clearStaff,
  characters: clearCharacters,
};

const arg: string = process.argv[2];
const command: Lambda = COMMANDS[arg];

if (command) {
  command();
} else {
  logger.error(`Usage: ts-node clear.ts [${Object.keys(COMMANDS).join('|')}]`);
  process.exit(1);
}
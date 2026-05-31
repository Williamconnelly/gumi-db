import * as fs from 'fs';
import { Logger } from '../logging';
import { Pipeline } from './constants';
import { PipelineState } from './pipeline-state';

const logger: Logger = new Logger('Clear');

function clearAnime(): void {
  fs.rmSync(Pipeline.ANIME_DIR, { recursive: true, force: true });
  fs.mkdirSync(Pipeline.ANIME_DIR, { recursive: true });

  const state: PipelineState = new PipelineState();
  state.resetAnime();

  logger.info('Anime output cleared and state reset');
}

function clearManga(): void {
  fs.rmSync(Pipeline.MANGA_DIR, { recursive: true, force: true });
  fs.mkdirSync(Pipeline.MANGA_DIR, { recursive: true });

  const state: PipelineState = new PipelineState();
  state.resetManga();

  logger.info('Manga output cleared and state reset');
}

const arg: string = process.argv[2];

if (arg === 'anime')
  clearAnime();
else if (arg === 'manga')
  clearManga();
else
  logger.error('Usage: ts-node clear.ts [anime|manga]');
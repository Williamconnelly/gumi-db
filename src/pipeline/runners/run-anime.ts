import * as fs from 'fs';
import * as path from 'path';
import { AniListClient, IAniListMedia } from '../../ani-list';
import { Logger } from '../../logging';
import { OUTPUT_PATHS, PIPELINE_TIME } from '../constants';
import { PipelineState } from '../pipeline-state';

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('RunAnime');

function writeYear(year: number, media: IAniListMedia[]): void {
  const filePath: string = path.join(OUTPUT_PATHS.ANIME_DIR, `${year}.json`);
  fs.writeFileSync(filePath, JSON.stringify(media, null, 2), 'utf-8');
}

async function runAnime(): Promise<void> {

  fs.mkdirSync(OUTPUT_PATHS.ANIME_DIR, { recursive: true });

  const state: PipelineState = new PipelineState();
  let year: number = state.anime.lastCompletedYear + 1;

  logger.info(`Resuming from year ${year}`);

  while (true) {
    let media: IAniListMedia[];

    try {
      media = await client.fetchAnimeByYear(year);
    } catch {
      logger.error(`Failed to fetch year ${year}. Aborting.`);
      process.exit(1);
    }

    writeYear(year, media);
    logger.info(`Wrote ${media.length} entries for ${year}`);

    state.anime.lastCompletedYear = year;
    state.save();

    if (year >= PIPELINE_TIME.END_YEAR) {
      logger.info('All years complete');
      break;
    }

    year++;
  }
}

async function main(): Promise<void> {
  await runAnime();
}

main().catch((err: unknown) => {
  logger.error('Unhandled error', 'main', err);
  process.exit(1);
});
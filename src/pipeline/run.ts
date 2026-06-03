import * as fs from 'fs';
import * as path from 'path';
import { AniListClient, EMediaType, IAniListMedia } from '../ani-list';
import { Logger, ScopedLogger } from '../logging';
import { OUTPUT_PATHS, PIPELINE_TIME } from './constants';
import { PipelineState } from './pipeline-state';

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('Runner');

function writeMedia(
  type: EMediaType,
  year: number,
  media: IAniListMedia[]
): void {
  const directory: string = type === EMediaType.ANIME ? OUTPUT_PATHS.ANIME_DIR : OUTPUT_PATHS.MANGA_DIR;
  const filePath: string = path.join(directory, `${year}.json`);

  fs.writeFileSync(filePath, JSON.stringify(media, null, 2), 'utf-8');
}

async function getMedia(type: EMediaType, state: PipelineState): Promise<void> {
  const stateKey: 'anime' | 'manga' = type === EMediaType.ANIME ? 'anime' : 'manga';
  let year: number = state[stateKey].lastCompletedYear + 1;
  const fetchFn: (year: number) => Promise<IAniListMedia[]> = type === EMediaType.ANIME ?
    client.fetchAnimeByYear.bind(client) :
    client.fetchMangaByYear.bind(client);

  const log: ScopedLogger = logger.scope(`get${type}`);

  while (true) {
    let media: IAniListMedia[];

    try {
      media = await fetchFn(year);
    } catch (err) {
      log.error(`Failed to fetch ${type} year ${year}. Aborting.`);
      process.exit(1);
    }

    writeMedia(type, year, media);
    state[stateKey].lastCompletedYear = year;
    state.save();

    log.info(`Success - ${media.length} entries written to ${year} ${type}`);

    if (year + 1 > PIPELINE_TIME.END_YEAR) {
      log.info(`Success - Completed writing all ${type}`);
      break;
    } else
      year++;
  }
}

async function runAnime(): Promise<void> {
  fs.mkdirSync(OUTPUT_PATHS.ANIME_DIR, { recursive: true });

  await getMedia(EMediaType.ANIME, new PipelineState());

  logger.info('Success - Anime Pipeline Complete');
}

async function runManga(): Promise<void> {
  fs.mkdirSync(OUTPUT_PATHS.MANGA_DIR, { recursive: true });

  await getMedia(EMediaType.MANGA, new PipelineState());

  logger.info('Success - Manga Pipeline Complete');
}

const arg: string = process.argv[2];

if (arg === 'anime')
  runAnime();
else if (arg === 'manga')
  runManga();
else
  logger.error('Usage: ts-node run.ts [anime|manga]');
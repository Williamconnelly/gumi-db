import * as fs from 'fs';
import * as path from 'path';
import { AniListClient, EMediaType, IAniListMedia } from '../ani-list';
import { Logger, ScopedLogger } from '../logging';
import { IPipelineState } from './interfaces';

const OUTPUT_DIR: string = path.resolve('output');
const ANIME_DIR: string = path.join(OUTPUT_DIR, 'anime');
const MANGA_DIR: string = path.join(OUTPUT_DIR, 'manga');
const STATE_FILE: string = path.join(OUTPUT_DIR, 'state.json');


const START_YEAR: number = 1900;
const FUTURE_YEAR_BUFFER: number = 5;
const END_YEAR: number = new Date().getFullYear() + FUTURE_YEAR_BUFFER;

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('Runner');

function readState(): IPipelineState {
  if (!fs.existsSync(STATE_FILE)) {
    return {
      anime: { lastCompletedYear: START_YEAR - 1 },
      manga: { lastCompletedYear: START_YEAR - 1, },
    }
  }

  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')) as IPipelineState;
}

function writeState(state: IPipelineState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function writeMedia(
  type: EMediaType,
  year: number,
  media: IAniListMedia[]
): void {
  let directory: string = '';

  if (type === EMediaType.ANIME)
    directory = ANIME_DIR;
  else if (type === EMediaType.MANGA)
    directory = MANGA_DIR;

  const filePath: string = path.join(directory, `${year}.json`);

  fs.writeFileSync(filePath, JSON.stringify(media, null, 2), 'utf-8');
}

async function getMedia(type: EMediaType, state: IPipelineState): Promise<void> {
  const stateKey: keyof IPipelineState = type.toLowerCase() as keyof IPipelineState;
  let year: number = state[stateKey].lastCompletedYear + 1;
  let fetchFn: (year: number) => Promise<IAniListMedia[]> = async (year: number) => [];

  if (type === EMediaType.ANIME)
    fetchFn = client.fetchAnimeByYear.bind(client);
  else if (type === EMediaType.MANGA)
    fetchFn = client.fetchMangaByYear.bind(client);

  const log: ScopedLogger = logger.scope(`get${type}`);

  log.info(`Fetching ${type} from year ${year}`);

  while (true) {
    let media: IAniListMedia[];

    try {
      media = await fetchFn(year);
    } catch (err) {
      log.error(`Failed to fetch ${type} year ${year}. Aborting.`)
      process.exit(1);
    }

    writeMedia(type, year, media);
    state[stateKey].lastCompletedYear = year;
    writeState(state);

    log.info(`Success - ${media.length} entries written to ${year} ${type}`);

    if (year + 1 > END_YEAR) {
      log.info(`Success - Completed writing all ${type}`);

      break;
    } else
      year++;
  }
}

async function runAnime(): Promise<void> {
  fs.mkdirSync(ANIME_DIR, { recursive: true });

  await getMedia(EMediaType.ANIME, readState());

  logger.info('Success - Anime Pipeline Complete');
}

async function runManga(): Promise<void> {
  fs.mkdirSync(MANGA_DIR, { recursive: true });

  await getMedia(EMediaType.MANGA, readState());

  logger.info('Success - Manga Pipeline Complete');
}

const arg: string = process.argv[2];

if (arg === 'anime')
  runAnime();
else if (arg === 'manga')
  runManga();
else
  logger.error('Usage: ts-node run.ts [anime|manga]');
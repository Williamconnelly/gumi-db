import * as fs from 'fs';
import { AniListClient, IAniListMediaTag, IAniListStudio } from '../ani-list';
import { Logger, ScopedLogger } from '../logging';
import { OUTPUT_PATHS } from './constants';

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('Fetch');

async function fetchGenres(): Promise<void> {
  const log: ScopedLogger = logger.scope('fetchGenres');

  try {
    const genres: string[] = await client.fetchGenres();
    fs.writeFileSync(OUTPUT_PATHS.GENRES_FILE, JSON.stringify(genres, null, 2), 'utf-8');
    log.info(`Wrote ${genres.length} genres`);
  } catch (err) {
    log.error('Failed to fetch genres');
    process.exit(1);
  }
}

async function fetchTags(): Promise<void> {
  const log: ScopedLogger = logger.scope('fetchTags');

  try {
    const tags: IAniListMediaTag[] = await client.fetchTags();
    fs.writeFileSync(OUTPUT_PATHS.TAGS_FILE, JSON.stringify(tags, null, 2), 'utf-8');
    log.info(`Wrote ${tags.length} tags`);
  } catch (err) {
    log.error('Failed to fetch tags');
    process.exit(1);
  }
}

async function fetchStudios(): Promise<void> {
  const log: ScopedLogger = logger.scope('fetchStudios');

  try {
    const studios: IAniListStudio[] = await client.fetchStudios();
    fs.writeFileSync(OUTPUT_PATHS.STUDIOS_FILE, JSON.stringify(studios, null, 2), 'utf-8');
    log.info(`Wrote ${studios.length} studios`);
  } catch (err) {
    log.error('Failed to fetch studios');
    process.exit(1);
  }
}

const arg: string = process.argv[2];

if (arg === 'genres')
  fetchGenres();
else if (arg === 'tags')
  fetchTags();
else if (arg === 'studios')
  fetchStudios();
else
  logger.error('Usage: ts-node fetch.ts [genres|tags|studios]');
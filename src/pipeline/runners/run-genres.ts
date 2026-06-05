import * as fs from 'fs';
import { AniListClient } from '../../ani-list';
import { Logger } from '../../logging';
import { OUTPUT_PATHS } from '../constants';

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('RunGenres');

async function runGenres(): Promise<void> {
  try {
    const genres: string[] = await client.fetchGenres();
    fs.writeFileSync(OUTPUT_PATHS.GENRES_FILE, JSON.stringify(genres, null, 2), 'utf-8');
    logger.info(`Wrote ${genres.length} genres`);
  } catch {
    logger.error('Failed to fetch genres');
    process.exit(1);
  }
}

async function main(): Promise<void> {
  await runGenres();
}

main().catch((err: unknown) => {
  logger.error('Unhandled error', 'main', err);
  process.exit(1);
});
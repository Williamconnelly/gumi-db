import * as fs from 'fs';
import { AniListClient, IAniListStudio } from '../../ani-list';
import { Logger } from '../../logging';
import { OUTPUT_PATHS } from '../constants';

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('RunStudios');

async function runStudios(): Promise<void> {
  try {
    const studios: IAniListStudio[] = await client.fetchStudios();
    fs.writeFileSync(OUTPUT_PATHS.STUDIOS_FILE, JSON.stringify(studios, null, 2), 'utf-8');
    logger.info(`Wrote ${studios.length} studios`);
  } catch {
    logger.error('Failed to fetch studios');
    process.exit(1);
  }
}

async function main(): Promise<void> {
  await runStudios();
}

main().catch((err: unknown) => {
  logger.error('Unhandled error', 'main', err);
  process.exit(1);
});
import * as fs from 'fs';
import { AniListClient, IAniListMediaTag } from '../../ani-list';
import { Logger } from '../../logging';
import { OUTPUT_PATHS } from '../constants';

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('RunTags');

async function runTags(): Promise<void> {
  try {
    const tags: IAniListMediaTag[] = await client.fetchTags();
    fs.writeFileSync(OUTPUT_PATHS.TAGS_FILE, JSON.stringify(tags, null, 2), 'utf-8');
    logger.info(`Wrote ${tags.length} tags`);
  } catch {
    logger.error('Failed to fetch tags');
    process.exit(1);
  }
}

async function main(): Promise<void> {
  await runTags();
}

main().catch((err: unknown) => {
  logger.error('Unhandled error', 'main', err);
  process.exit(1);
});
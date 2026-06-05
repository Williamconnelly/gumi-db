import * as fs from 'fs';
import * as path from 'path';
import { IAniListMedia } from '../../ani-list';
import { Logger } from '../../logging';
import { OUTPUT_PATHS } from '../constants';

const logger: Logger = new Logger('CollectStaffIds');

function collectStaffIds(): void {
  const ids: Set<number> = new Set<number>();

  for (const dir of [OUTPUT_PATHS.ANIME_DIR, OUTPUT_PATHS.MANGA_DIR]) {
    const files: string[] = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const media: IAniListMedia[] = JSON.parse(
        fs.readFileSync(path.join(dir, file), 'utf-8')
      ) as IAniListMedia[];

      for (const m of media)
        m.staff?.edges
          ?.map(e => e.node?.id)
          .filter((id): id is number => id != null)
          .forEach(id => ids.add(id));
    }
  }

  fs.writeFileSync(OUTPUT_PATHS.STAFF_IDS_FILE, JSON.stringify([...ids], null, 2), 'utf-8');
  logger.info(`Collected ${ids.size} unique staff IDs`);
}

function main(): void {
  collectStaffIds();
}

try {
  main();
} catch (err: unknown) {
  logger.error('Unhandled error', 'main', err);
  process.exit(1);
}
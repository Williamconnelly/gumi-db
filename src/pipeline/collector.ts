import * as fs from 'fs';
import path from 'path';
import { IAniListMedia } from '../ani-list';
import { Logger } from '../logging';
import { OUTPUT_PATHS } from './constants';

const logger: Logger = new Logger('collectEdgeIds');

function collectEdgeIds(
  outputFile: string,
  getEdges: (media: IAniListMedia) => number[],
): void {
  const ids: Set<number> = new Set<number>();

  for (const dir of [OUTPUT_PATHS.ANIME_DIR, OUTPUT_PATHS.MANGA_DIR]) {
    const files: string[] = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const media: IAniListMedia[] = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as IAniListMedia[];

      for (const m of media)
        getEdges(m).forEach(id => ids.add(id));
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify([...ids], null, 2), 'utf-8');
  logger.info(`Collected ${ids.size} unique IDs`);
}

function collectCharacterIds(): void {
  collectEdgeIds(
    OUTPUT_PATHS.CHARACTER_IDS_FILE,
    (m) => m.characters?.edges?.map(e => e.node?.id).filter((id): id is number => id != null) || [],
  );
}

function collectStaffIds(): void {
  collectEdgeIds(
    OUTPUT_PATHS.STAFF_IDS_FILE,
    m => m.staff?.edges?.map(e => e.node?.id).filter((id): id is number => id != null) || [],
  );
}

const arg: string = process.argv[2];

if (arg === 'characters')
  collectCharacterIds();
else if (arg === 'staff')
  collectStaffIds();
else
  logger.error('Usage: ts-node collect.ts [characters|staff]');

import * as fs from 'fs';
import * as path from 'path';
import { AniListClient, IAniListCharacter } from '../ani-list';
import { batchArray } from '../common';
import { Logger, ScopedLogger } from '../logging';
import { OUTPUT_PATHS } from './constants';
import { PipelineState } from './pipeline-state';

const FETCH_BATCH_SIZE: number = 50;
const FILE_CHUNK_SIZE: number = 5000;

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('CharacterRunner');

function readCharacterIds(): number[] {
  return JSON.parse(fs.readFileSync(OUTPUT_PATHS.CHARACTER_IDS_FILE, 'utf-8')) as number[];
}

function writeChunk(chunkIndex: number, characters: IAniListCharacter[]): void {
  const filePath: string = path.join(OUTPUT_PATHS.CHARACTERS_DIR, `${chunkIndex}.json`);
  fs.writeFileSync(filePath, JSON.stringify(characters, null, 2), 'utf-8');
}

export async function runCharacters(): Promise<void> {
  const log: ScopedLogger = logger.scope('runCharacters');

  fs.mkdirSync(OUTPUT_PATHS.CHARACTERS_DIR, { recursive: true });

  const state: PipelineState = new PipelineState();
  const allIds: number[] = readCharacterIds();
  const batches: number[][] = batchArray(allIds, FETCH_BATCH_SIZE);
  const resumeFrom: number = state.characters.lastCompletedBatch + 1;

  log.info(`${allIds.length} character IDs — ${batches.length} fetch batches — resuming from batch ${resumeFrom}`);

  let accumulated: IAniListCharacter[] = [];
  let chunkIndex: number = Math.floor((resumeFrom * FETCH_BATCH_SIZE) / FILE_CHUNK_SIZE);

  for (let i: number = resumeFrom; i < batches.length; i++) {
    const batch: number[] = batches[i];
    let characters: IAniListCharacter[];

    try {
      characters = await client.fetchCharacters(batch);
    } catch (err) {
      log.error(`Failed on batch ${i}. Aborting.`);
      process.exit(1);
    }

    accumulated.push(...characters);

    log.info(`Fetched ${accumulated.length}/${FILE_CHUNK_SIZE}`);

    if (accumulated.length >= FILE_CHUNK_SIZE) {
      writeChunk(chunkIndex, accumulated);
      log.info(`Wrote chunk ${chunkIndex} (${accumulated.length} characters)`);
      accumulated = [];
      chunkIndex++;
      state.characters.lastCompletedBatch = i;
      state.save();
    }
  }

  if (accumulated.length > 0) {
    writeChunk(chunkIndex, accumulated);
    log.info(`Wrote final chunk ${chunkIndex} (${accumulated.length} characters)`);
    state.characters.lastCompletedBatch = batches.length - 1;
    state.save();
  }

  log.info('Character pipeline complete');
}

async function main(): Promise<void> {
  await runCharacters();
}

main().catch((error: string) => {
  logger.error(error);
  process.exit(1);
});
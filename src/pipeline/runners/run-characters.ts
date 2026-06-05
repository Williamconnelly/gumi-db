import * as fs from 'fs';
import * as path from 'path';
import { AniListClient, IAniListCharacter } from '../../ani-list';
import { batchArray } from '../../common';
import { Logger } from '../../logging';
import { OUTPUT_PATHS, PIPELINE } from '../constants';
import { PipelineState } from '../pipeline-state';

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('RunCharacters');

function readCharacterIds(): number[] {
  return JSON.parse(fs.readFileSync(OUTPUT_PATHS.CHARACTER_IDS_FILE, 'utf-8')) as number[];
}

function writeChunk(chunkIndex: number, characters: IAniListCharacter[]): void {
  const filePath: string = path.join(OUTPUT_PATHS.CHARACTERS_DIR, `${chunkIndex}.json`);
  fs.writeFileSync(filePath, JSON.stringify(characters, null, 2), 'utf-8');
}

async function runCharacters(): Promise<void> {
  const batchSize: number = PIPELINE.FETCH_BATCH_SIZE;
  const chunkSize: number = PIPELINE.FILE_CHUNK_SIZE;

  fs.mkdirSync(OUTPUT_PATHS.CHARACTERS_DIR, { recursive: true });

  const state: PipelineState = new PipelineState();
  const allIds: number[] = readCharacterIds();
  const batches: number[][] = batchArray(allIds, batchSize);
  const resumeFrom: number = state.characters.lastCompletedBatch + 1;

  logger.info(`${allIds.length} character IDs — ${batches.length} fetch batches — resuming from batch ${resumeFrom}`);

  let accumulated: IAniListCharacter[] = [];
  let chunkIndex: number = Math.floor((resumeFrom * batchSize) / chunkSize);

  for (let i: number = resumeFrom; i < batches.length; i++) {
    let characters: IAniListCharacter[];

    try {
      characters = await client.fetchCharacters(batches[i]);
    } catch {
      logger.error(`Failed on batch ${i}. Aborting.`);
      process.exit(1);
    }

    accumulated.push(...characters);
    logger.info(`Fetched ${accumulated.length}/${chunkSize}`);

    if (accumulated.length >= chunkSize) {
      writeChunk(chunkIndex, accumulated);
      logger.info(`Wrote chunk ${chunkIndex} (${accumulated.length} characters)`);
      accumulated = [];
      chunkIndex++;
      state.characters.lastCompletedBatch = i;
      state.save();
    }
  }

  if (accumulated.length > 0) {
    writeChunk(chunkIndex, accumulated);
    logger.info(`Wrote final chunk ${chunkIndex} (${accumulated.length} characters)`);
    state.characters.lastCompletedBatch = batches.length - 1;
    state.save();
  }

  logger.info('Character pipeline complete');
}

async function main(): Promise<void> {
  await runCharacters();
}

main().catch((err: unknown) => {
  logger.error('Unhandled error', 'main', err);
  process.exit(1);
});
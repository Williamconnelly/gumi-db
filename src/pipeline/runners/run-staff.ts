import * as fs from 'fs';
import * as path from 'path';
import { AniListClient, IAniListStaff } from '../../ani-list';
import { batchArray } from '../../common';
import { Logger } from '../../logging';
import { OUTPUT_PATHS, PIPELINE } from '../constants';
import { PipelineState } from '../pipeline-state';

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('RunStaff');

function readStaffIds(): number[] {
  return JSON.parse(fs.readFileSync(OUTPUT_PATHS.STAFF_IDS_FILE, 'utf-8')) as number[];
}

function writeChunk(chunkIndex: number, staff: IAniListStaff[]): void {
  const filePath: string = path.join(OUTPUT_PATHS.STAFF_DIR, `${chunkIndex}.json`);
  fs.writeFileSync(filePath, JSON.stringify(staff, null, 2), 'utf-8');
}

async function runStaff(): Promise<void> {
  const batchSize: number = PIPELINE.FETCH_BATCH_SIZE;
  const chunkSize: number = PIPELINE.FILE_CHUNK_SIZE;

  fs.mkdirSync(OUTPUT_PATHS.STAFF_DIR, { recursive: true });

  const state: PipelineState = new PipelineState();
  const allIds: number[] = readStaffIds();
  const batches: number[][] = batchArray(allIds, batchSize);
  const resumeFrom: number = state.staff.lastCompletedBatch + 1;

  logger.info(`${allIds.length} staff IDs — ${batches.length} fetch batches — resuming from batch ${resumeFrom}`);

  let accumulated: IAniListStaff[] = [];
  let chunkIndex: number = Math.floor((resumeFrom * batchSize) / chunkSize);

  for (let i: number = resumeFrom; i < batches.length; i++) {
    let staff: IAniListStaff[];

    try {
      staff = await client.fetchStaff(batches[i]);
    } catch {
      logger.error(`Failed on batch ${i}. Aborting.`);
      process.exit(1);
    }

    accumulated.push(...staff);

    if (accumulated.length >= chunkSize) {
      writeChunk(chunkIndex, accumulated);
      logger.info(`Wrote chunk ${chunkIndex} (${accumulated.length} staff)`);
      accumulated = [];
      chunkIndex++;
      state.staff.lastCompletedBatch = i;
      state.save();
    }
  }

  if (accumulated.length > 0) {
    writeChunk(chunkIndex, accumulated);
    logger.info(`Wrote final chunk ${chunkIndex} (${accumulated.length} staff)`);
    state.staff.lastCompletedBatch = batches.length - 1;
    state.save();
  }

  logger.info('Staff pipeline complete');
}

async function main(): Promise<void> {
  await runStaff();
}

main().catch((err: unknown) => {
  logger.error('Unhandled error', 'main', err);
  process.exit(1);
});
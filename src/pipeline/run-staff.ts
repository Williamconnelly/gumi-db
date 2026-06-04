import * as fs from 'fs';
import * as path from 'path';
import { AniListClient, IAniListStaff } from '../ani-list';
import { batchArray } from '../common';
import { Logger, ScopedLogger } from '../logging';
import { OUTPUT_PATHS } from './constants';
import { PipelineState } from './pipeline-state';

const FETCH_BATCH_SIZE: number = 50;
const FILE_CHUNK_SIZE: number = 5000;

const client: AniListClient = new AniListClient();
const logger: Logger = new Logger('StaffRunner');

function readStaffIds(): number[] {
  return JSON.parse(fs.readFileSync(OUTPUT_PATHS.STAFF_IDS_FILE, 'utf-8')) as number[];
}

function writeChunk(chunkIndex: number, staff: IAniListStaff[]): void {
  const filePath: string = path.join(OUTPUT_PATHS.STAFF_DIR, `${chunkIndex}.json`);
  fs.writeFileSync(filePath, JSON.stringify(staff, null, 2), 'utf-8');
}

export async function runStaff(): Promise<void> {
  const log: ScopedLogger = logger.scope('runStaff');

  fs.mkdirSync(OUTPUT_PATHS.STAFF_DIR, { recursive: true });

  const state: PipelineState = new PipelineState();
  const allIds: number[] = readStaffIds();
  const batches: number[][] = batchArray(allIds, FETCH_BATCH_SIZE);
  const resumeFrom: number = state.staff.lastCompletedBatch + 1;

  log.info(`${allIds.length} staff IDs — ${batches.length} fetch batches — resuming from batch ${resumeFrom}`);

  let accumulated: IAniListStaff[] = [];
  let chunkIndex: number = Math.floor((resumeFrom * FETCH_BATCH_SIZE) / FILE_CHUNK_SIZE);

  for (let i: number = resumeFrom; i < batches.length; i++) {
    const batch: number[] = batches[i];
    let staff: IAniListStaff[];

    try {
      staff = await client.fetchStaff(batch);
    } catch (err) {
      log.error(`Failed on batch ${i}. Aborting.`);
      process.exit(1);
    }

    accumulated.push(...staff);

    log.info(`Fetched ${accumulated.length}/${FILE_CHUNK_SIZE}`);

    if (accumulated.length >= FILE_CHUNK_SIZE) {
      writeChunk(chunkIndex, accumulated);
      log.info(`Wrote chunk ${chunkIndex} (${accumulated.length} staff)`);
      accumulated = [];
      chunkIndex++;
      state.staff.lastCompletedBatch = i;
      state.save();
    }
  }

  // Flush any remaining staff that didn't fill a complete chunk
  if (accumulated.length > 0) {
    writeChunk(chunkIndex, accumulated);
    log.info(`Wrote final chunk ${chunkIndex} (${accumulated.length} staff)`);
    state.staff.lastCompletedBatch = batches.length - 1;
    state.save();
  }

  log.info('Staff pipeline complete');
}

async function main(): Promise<void> {
  await runStaff();
}

main().catch((error: string) => {
  logger.error(error);
  process.exit(1);
});
import * as fs from 'fs';
import { OUTPUT_PATHS, PIPELINE_TIME } from './constants';
import { IPipelineState } from './interfaces';

export class PipelineState implements IPipelineState {

  public static readonly DEFAULT_STATE: IPipelineState = {
    anime: { lastCompletedYear: PIPELINE_TIME.START_YEAR - 1 },
    manga: { lastCompletedYear: PIPELINE_TIME.START_YEAR - 1 },
    staff: { lastCompletedBatch: -1 },
    characters: { lastCompletedBatch: -1 }
  }

  private _state: IPipelineState;

  constructor() {
    this._state = this.read();
  }

  get anime() {
    return this._state.anime;
  }

  get manga() {
    return this._state.manga;
  }

  get staff() {
    return this._state.staff;
  }

  get characters() {
    return this._state.characters;
  }

  public resetAnime(): void {
    this._state.anime = { ...PipelineState.DEFAULT_STATE.anime };
    this.save();
  }

  public resetManga(): void {
    this._state.manga = { ...PipelineState.DEFAULT_STATE.manga };
    this.save();
  }

  public resetStaff(): void {
    this._state.staff = { ...PipelineState.DEFAULT_STATE.staff };
    this.save();
  }

  public resetCharacters(): void {
    this._state.characters = { ...PipelineState.DEFAULT_STATE.characters };
    this.save();
  }

  public save(): void {
    fs.writeFileSync(OUTPUT_PATHS.STATE_FILE, JSON.stringify(this._state, null, 2), 'utf-8');
  }

  private read(): IPipelineState {
    if (!fs.existsSync(OUTPUT_PATHS.STATE_FILE))
      return structuredClone(PipelineState.DEFAULT_STATE);

    return JSON.parse(fs.readFileSync(OUTPUT_PATHS.STATE_FILE, 'utf-8')) as IPipelineState;
  }
}
import * as fs from 'fs';
import { Pipeline } from './constants';
import { IPipelineState } from './interfaces';

export class PipelineState implements IPipelineState {

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

  public resetAnime(): void {
    this._state.anime = { ...Pipeline.DEFAULT_STATE.anime };
    this.save();
  }

  public resetManga(): void {
    this._state.manga = { ...Pipeline.DEFAULT_STATE.manga };
    this.save();
  }

  public save(): void {
    fs.writeFileSync(Pipeline.STATE_FILE, JSON.stringify(this._state, null, 2), 'utf-8');
  }

  private read(): IPipelineState {
    if (!fs.existsSync(Pipeline.STATE_FILE))
      return structuredClone(Pipeline.DEFAULT_STATE);

    return JSON.parse(fs.readFileSync(Pipeline.STATE_FILE, 'utf-8')) as IPipelineState;
  }
}
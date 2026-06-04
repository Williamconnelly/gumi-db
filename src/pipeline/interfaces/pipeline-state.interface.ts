export interface IPipelineState {
  anime: {
    lastCompletedYear: number;
  };
  manga: {
    lastCompletedYear: number;
  };
  characters: {
    lastCompletedBatch: number;
  };
  staff: {
    lastCompletedBatch: number
  };
}
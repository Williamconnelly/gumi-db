import { IAniListStudio } from './ani-list-studio.interface';

export interface IAniListStudioEdge {
  id?: number;
  node?: IAniListStudio;
  /** Whether this is the main production studio */
  isMain?: boolean;
}
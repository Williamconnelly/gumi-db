import { AniListMediaConnection } from '../types';

export interface IAniListStudio {
  id?: number;
  name?: string;
  isAnimationStudio?: boolean;
  media?: AniListMediaConnection;
  favourites?: number;
}

import { IAniListMedia } from './ani-list-media.interface';

export interface IAniListRecommendation {
  id: number;
  rating: number;
  media: IAniListMedia;
  mediaRecommendation: IAniListMedia;
}
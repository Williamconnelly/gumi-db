import { IAniListCharacter } from './ani-list-character.interface';
import { IAniListMedia } from './ani-list-media.interface';
import { IAniListPageInfo } from './ani-list-page-info.interface';
import { IAniListRecommendation } from './ani-list-recommendation.interface';
import { IAniListStaff } from './ani-list-staff.interface';
import { IAniListStudio } from './ani-list-studio.interface';

export interface IAniListPage {
  pageInfo: IAniListPageInfo;
  media?: IAniListMedia[];
  characters?: IAniListCharacter[];
  staff?: IAniListStaff[];
  studios?: IAniListStudio[];
  recommendations?: IAniListRecommendation[];
}
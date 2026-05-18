import { AniListCharacterConnection, AniListMediaConnection } from '../types';
import { IAniListFuzzyDate } from './ani-list-fuzzy-date.interface';
import { IAniListImageLinks } from './ani-list-image-links.interface';
import { IAniListName } from './ani-list-name.interface';

export interface IAniListStaff {
  id?: number;
  name?: IAniListName;
  languageV2?: string;
  image?: Pick<IAniListImageLinks, 'large' | 'medium'>
  description?: string;
  primaryOccupations?: string[];
  gender?: string;
  dateOfBirth?: IAniListFuzzyDate;
  dateOfDeath?: IAniListFuzzyDate;
  age?: number;
  yearsActive?: number[];
  homeTown?: string;
  bloodType?: string;
  isFavourite?: boolean;
  isFavouriteBlocked?: boolean;
  staffMedia?: AniListMediaConnection;
  characters?: AniListCharacterConnection;
  characterMedia?: AniListMediaConnection;
  updatedAt?: number;
  favourites?: number;
}
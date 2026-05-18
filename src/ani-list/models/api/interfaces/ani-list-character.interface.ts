import { AniListMediaConnection } from '../types';
import { IAniListCharacterName } from './ani-list-character-name.interface';
import { IAniListFuzzyDate } from './ani-list-fuzzy-date.interface';
import { IAniListImageLinks } from './ani-list-image-links.interface';

export interface IAniListCharacter {
  id?: number;
  name?: IAniListCharacterName;
  image?: Pick<IAniListImageLinks, 'large' | 'medium'>;
  description?: string;
  gender?: string;
  dateOfBirth?: IAniListFuzzyDate;
  age?: string;
  bloodType?: string;
  isFavourite?: boolean;
  isFavouriteBlocked?: boolean;
  media?: AniListMediaConnection;
  updatedAt?: number;
  favourites?: number;
  modNotes?: string;
}


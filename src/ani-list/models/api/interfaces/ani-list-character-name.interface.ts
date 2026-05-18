import { IAniListName } from './ani-list-name.interface';

export interface IAniListCharacterName extends IAniListName {
  alternativeSpoiler?: string[];
}
import { WithRequired } from '../../../common';
import { IAniListPage } from '../../models';
import { IAniListPageResponse } from '../interfaces';

export type GetCharactersDataResponse = IAniListPageResponse<WithRequired<IAniListPage, 'characters' | 'pageInfo'>>;
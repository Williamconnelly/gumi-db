import { WithRequired } from '../../../common';
import { IAniListPage } from '../../models';
import { IAniListPageResponse } from '../interfaces';

export type GetStudiosDataResponse = IAniListPageResponse<WithRequired<IAniListPage, 'studios' | 'pageInfo'>>;

import { WithRequired } from '../../../common';
import { IAniListPage } from '../../models';
import { IAniListPageResponse } from '../interfaces';

export type GetMediaDataResponse = IAniListPageResponse<WithRequired<IAniListPage, 'media'>>;

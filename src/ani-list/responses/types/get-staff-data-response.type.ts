import { WithRequired } from '../../../common';
import { IAniListPage } from '../../models';
import { IAniListPageResponse } from '../interfaces';

export type GetStaffDataResponse = IAniListPageResponse<WithRequired<IAniListPage, 'staff' | 'pageInfo'>>;
import { IAniListPageInfo } from './ani-list-page-info.interface';

export interface IAniListConnection<Edge, Nodes> {
  edges?: Edge[];
  nodes?: Nodes[];
  pageInfo?: IAniListPageInfo;
}
import { AniListQueries, IAniListMedia } from '.';
import { HttpClient } from '../http';
import { GetMediaDataResponse, IAniListResponse } from './responses';

export class AniListClient extends HttpClient {

  private static readonly BASE_URL = 'https://graphql.anilist.co';

  private static readonly REQUESTS_PER_MINUTE: number = 25;

  private static readonly PAGE_SIZE: number = 50;

  constructor() {
    super({
      baseUrl: AniListClient.BASE_URL,
      clientName: 'AniListClient',
      delayMs: Math.ceil(60 * 1000 / AniListClient.REQUESTS_PER_MINUTE),
    })
  }

  protected async query<T>(
    query: string,
    variables: Record<string, any>,
  ): Promise<T> {
    const response: IAniListResponse<T> = await this.post<IAniListResponse<T>>('/', { query, variables });

    return response.data;
  }

  public async fetchMediaPage(mediaPage: number): Promise<GetMediaDataResponse> {
    const log = this.logger.scope('fetchMediaPage');

    log.info(`Fetching page ${mediaPage}...`);
    const timer = this.logger.time(`Page ${mediaPage} fetch`, 'fetchMediaPage');

    const result: GetMediaDataResponse = await this.query<GetMediaDataResponse>(AniListQueries.GET_MEDIA, {
      mediaPage: mediaPage,
      edgePage: 1,
      perPage: AniListClient.PAGE_SIZE,
    });

    timer.stop();
    log.info(`Received ${result.Page.media.length} media — checking for incomplete edges...`);

    const hydratedResult: IAniListMedia[] = await this.fillEdges(result.Page.media);

    result.Page.media = hydratedResult;

    return result;
  }

  protected findIncompleteMedia(media: IAniListMedia[]): IAniListMedia[] {
    return media.filter((m: IAniListMedia) => (
      m.staff?.pageInfo?.hasNextPage ||
      m.characters?.pageInfo?.hasNextPage ||
      m.recommendations?.pageInfo?.hasNextPage
    ));
  }

  protected async fetchMediaEdges(ids: number[], page: number) {
    const data = await this.query<GetMediaDataResponse>(AniListQueries.GET_MEDIA_EDGES, { ids, page });

    return data.Page.media;
  }

  protected async fillEdges(media: IAniListMedia[]): Promise<IAniListMedia[]> {
    const log = this.logger.scope('fillEdges');

    const mediaMap: Map<number, IAniListMedia> = new Map(media.map(m => [m.id!, { ...m }]));
    let page: number = 2;
    let incompleteMedia: IAniListMedia[] = this.findIncompleteMedia(media);
    let incompleteIds: number[] = incompleteMedia.map(m => m.id!);
    let isPaginating: boolean = !!incompleteMedia.length;

    if (!isPaginating) {
      log.info('All edges complete — no additional fetches needed');
      return [...mediaMap.values()];
    }

    log.info(`${incompleteMedia.length} media have incomplete edges — beginning pagination...`);

    while (isPaginating) {
      log.info(`Fetching edge page ${page} for ${incompleteIds.length}`);
      const timer = this.logger.time(`Edge page ${page}`, 'fillEdges');

      const edges: IAniListMedia[] = await this.fetchMediaEdges(incompleteIds, page);

      timer.stop();

      edges.forEach((edge: IAniListMedia) => {
        const entry: IAniListMedia = mediaMap.get(edge.id!)!;

        entry.characters?.edges?.push(...edge.characters?.edges ?? []);
        entry.staff?.edges?.push(...edge.staff?.edges ?? []);
        entry.recommendations?.edges?.push(...edge.recommendations?.edges ?? []);

        entry.characters!.pageInfo = edge.characters?.pageInfo;
        entry.staff!.pageInfo = edge.staff?.pageInfo;
        entry.recommendations!.pageInfo = edge.recommendations?.pageInfo;
      });

      incompleteMedia = this.findIncompleteMedia(edges);
      incompleteIds = incompleteMedia.map(m => m.id!);
      page += 1;
      isPaginating = !!incompleteMedia.length;

      log.info(incompleteMedia.length
        ? `${incompleteMedia.length} media still incomplete — continuing to page ${page}...`
        : 'All edges complete'
      );
    }

    return [...mediaMap.values()];
  }
}

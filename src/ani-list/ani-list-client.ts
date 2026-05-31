import { AniListQueries, EMediaType, IAniListMedia } from '.';
import { HttpClient } from '../http';
import { ITimerStop, ScopedLogger } from '../logging';
import { GetMediaDataResponse, IAniListResponse } from './responses';
import { getAnimeFetchBounds, getMangaFetchBounds, IDateFetchBounds } from './utils';

export class AniListClient extends HttpClient {

  private static readonly BASE_URL = 'https://graphql.anilist.co';

  private static readonly REQUESTS_PER_MINUTE: number = 25;

  private static readonly RATE_TIMEOUT: number = 1000 * 65;

  /** The number of items on a query result */
  private static readonly PAGE_SIZE: number = 50;

  /** The maximum depth a page can be queried. Represents the limit of the data provided */
  private static readonly PAGE_LIMIT: number = 100;

  constructor() {
    super({
      baseUrl: AniListClient.BASE_URL,
      clientName: 'AniListClient',
      delayMs: Math.ceil(60 * 1000 / AniListClient.REQUESTS_PER_MINUTE),
      timeoutMs: AniListClient.RATE_TIMEOUT
    })
  }

  protected async query<T>(
    query: string,
    variables: Record<string, any>,
  ): Promise<T> {
    const response: IAniListResponse<T> = await this.post<IAniListResponse<T>>('/', { query, variables });

    return response.data;
  }

  public async fetchAnimeByYear(year: number): Promise<IAniListMedia[]> {
    const bounds: IDateFetchBounds = getAnimeFetchBounds(year);

    this.logger.info(`Fetching ANIME year ${year}...`, 'fetchAnimeByYear');

    return this.fetchAllPages(EMediaType.ANIME, bounds);
  }

  public async fetchMangaByYear(year: number): Promise<IAniListMedia[]> {
    const bounds: IDateFetchBounds[] = getMangaFetchBounds(year);
    let results: IAniListMedia[] = [];

    for (let i = 0; i < bounds.length; i++) {
      this.logger.info(`Fetching MANGA year ${year} Q${i + 1}...`, 'fetchMangaByYear');

      const media = await this.fetchAllPages(EMediaType.MANGA, bounds[i]);

      results = results.concat(media);
    }

    return results;
  }

  protected async fetchAllPages(type: EMediaType, bounds: IDateFetchBounds): Promise<IAniListMedia[]> {
    let currentPage: number = 1;
    let allMedia: IAniListMedia[] = [];

    while (true) {
      if (currentPage >= AniListClient.PAGE_LIMIT)
        throw new Error('Failed to complete query. AniList Query Depth Reached.');

      const timer: ITimerStop = this.logger.time(`${type} page ${currentPage} [${bounds.dateGreater}-${bounds.dateLesser}]`, 'fetchAllPages');
      let result: GetMediaDataResponse | null = null;

      try {
        result = await this.query<GetMediaDataResponse>(AniListQueries.GET_MEDIA, {
          mediaPage: currentPage,
          edgePage: 1,
          perPage: AniListClient.PAGE_SIZE,
          type,
          dateGreater: bounds.dateGreater,
          dateLesser: bounds.dateLesser,
        });
      } catch (err) {
        throw new Error(`Failed to fetch ${type} page ${currentPage} [${bounds.dateGreater}-${bounds.dateLesser}]: ${err}`);
      }

      timer.stop();

      const media: IAniListMedia[] = result.Page.media;
      const hydratedMedia: IAniListMedia[] = await this.fillEdges(media);

      allMedia = allMedia.concat(hydratedMedia);

      if (!result.Page.pageInfo.hasNextPage)
        break;

      currentPage++;
    }

    this.logger.info(`Fetched ${allMedia.length} ${type} entries for [${bounds.dateGreater}-${bounds.dateLesser}]`, 'fetchAllPages');

    return allMedia;
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
    const log: ScopedLogger = this.logger.scope('fillEdges');

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

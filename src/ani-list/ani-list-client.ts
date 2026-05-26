import { AniListQueries } from '.';
import { HttpClient } from '../http';
import { GetMediaDataResponse, IAniListResponse } from './responses';

export class AniListClient extends HttpClient {

  private static readonly BASE_URL = 'https://graphql.anilist.co';

  private static readonly REQUESTS_PER_MINUTE: number = 60;

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

  public async fetchMediaPage(page: number): Promise<GetMediaDataResponse> {
    return await this.query<GetMediaDataResponse>(AniListQueries.GET_MEDIA, {
      page,
      perPage: AniListClient.PAGE_SIZE,
    });
  }
}


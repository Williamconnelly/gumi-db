import { HttpClient } from '../http';

export class AniListClient extends HttpClient {

  private static readonly BASE_URL = 'https://graphql.anilist.co';

  private static readonly REQUESTS_PER_MINUTE: number = 60;

  constructor() {
    super({
      baseUrl: AniListClient.BASE_URL,
      clientName: 'AniListClient',
      delayMs: Math.ceil(60 * 1000 / AniListClient.REQUESTS_PER_MINUTE),
    })
  }



}



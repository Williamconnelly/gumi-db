export interface IHttpClientConfig {
  baseUrl: string;
  delayMs?: number;
  retryLimit?: number;
  timeoutMs?: number;
}

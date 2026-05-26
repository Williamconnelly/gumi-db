export interface IHttpClientConfig {
  baseUrl: string;
  clientName: string;
  delayMs?: number;
  retryLimit?: number;
  timeoutMs?: number;
}

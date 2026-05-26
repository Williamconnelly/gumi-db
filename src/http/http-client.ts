import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, HttpStatusCode } from 'axios';
import axiosRetry from 'axios-retry';
import { Logger } from '../logging';
import { IHttpClientConfig } from './interfaces';

export abstract class HttpClient {

  public readonly logger: Logger;

  protected static readonly DEFAULT_TIMEOUT: number = 1000 * 30;

  protected static readonly DEFAULT_RETRY_LIMIT: number = 3;

  protected readonly baseUrl: string;

  protected readonly client: AxiosInstance;

  protected readonly delayMs: number;

  protected readonly retryLimit: number;

  protected readonly timeoutMs: number;

  constructor(config: IHttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.delayMs = config?.delayMs ?? 0;
    this.timeoutMs = config?.timeoutMs ?? HttpClient.DEFAULT_TIMEOUT;
    this.retryLimit = config?.retryLimit ?? HttpClient.DEFAULT_RETRY_LIMIT;
    this.client = axios.create({ baseURL: config.baseUrl, timeout: this.timeoutMs });
    this.logger = new Logger(config.clientName);

    axiosRetry(this.client, {
      retries: this.retryLimit,
      retryCondition: (err: AxiosError) => {
        const status = err.response?.status;

        return !status || status >= HttpStatusCode.InternalServerError;
      },
      retryDelay: (retryCount: number) => 1000 * 2 ** (retryCount - 1),
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      this.interceptRejection.bind(this)
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);

    if (this.delayMs > 0)
      await this.sleep(this.delayMs);

    return response.data;
  }

  public async post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);

    if (this.delayMs > 0)
      await this.sleep(this.delayMs);

    return response.data;
  }

  protected sleep(durationMs: number) {
    return new Promise(resolve => setTimeout(resolve, durationMs));
  }

  protected async interceptRejection(error: AxiosError): Promise<AxiosResponse> {
    if (error.response?.status === HttpStatusCode.TooManyRequests) {
      const retryAfter = parseInt(error.response.headers['retry-after'] ?? '60', 10);

      this.logger.warn(`Rate limited. Waiting ${retryAfter}s...`, 'interceptRejection');

      await this.sleep(retryAfter * 1000);

      return this.client.request(error.config!);
    }
    return Promise.reject(error);
  }

}


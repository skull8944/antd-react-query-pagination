import type { QueryKey } from '@tanstack/react-query';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { generatePath } from 'react-router';

import { apiClientFactory } from './apiClientFactory';

import type { QueryResponse } from '@/types/query';
import type { PaginationRequest, PaginationResponse } from '@/types/pagination';

export class QueryUtil {
  /**
   * return { [key in queries]: `${prefix}-${key}` }
   * @param prefix ex: 'EXAMPLE'
   * @param queries ex: ['options']
   * @returns ex: { options: ['EXAMPLE-options'] }
   */
  static getQueryKeys<TPrefix extends string, TRecordKey extends string>(
    prefix: TPrefix,
    queries: readonly TRecordKey[],
  ): Record<TRecordKey, QueryKey> {
    return queries.reduce(
      (obj, key) => {
        obj[key] = [`${prefix}-${key}`];
        return obj;
      },
      {} as Record<TRecordKey, QueryKey>,
    );
  }

  static async query<
    TResponse,
    TRequest extends Record<string, unknown> = never,
  >({
    config,
    restParams,
  }: {
    config: AxiosRequestConfig<TRequest>;
    restParams?: Record<string, string | number | boolean>;
  }): Promise<QueryResponse<TResponse>> {
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    if (restParams && config.url) {
      config.url = generatePath(config.url, restParams);
    }

    if (config.method === 'GET' && config.data) {
      config.params = config.data;
      delete config.data;
    }

    const client = apiClientFactory<TRequest>(config);

    const res = await client.request<
      QueryResponse<TResponse>,
      AxiosResponse<QueryResponse<TResponse>>,
      TRequest
    >(config);

    return res.data;

    // error handling by interceptors in apiClientFactory
  }

  static async paginate<
    TResponse extends Record<string, unknown>,
    TSearchParams extends Record<string, unknown> = Record<string, unknown>,
  >(
    config: Required<
      Pick<
        AxiosRequestConfig<PaginationRequest<TSearchParams>>,
        'url' | 'data' | 'signal'
      >
    >,
  ): Promise<PaginationResponse<TResponse>> {
    if (!config.data?.pagination) {
      config.data.pagination = { current: 1, pageSize: 10 };
    }

    const res = await this.query<
      PaginationResponse<TResponse>,
      PaginationRequest<TSearchParams>
    >({
      config: {
        ...config,
        method: 'POST',
      },
    });

    if ('message' in res) {
      throw new Error(res.message);
    }

    return res.data;
  }
}

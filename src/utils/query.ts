import type { QueryKey } from '@tanstack/react-query';

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

  // static async query<TRequest, TResponse>({
  //   config,
  //   restParams,
  //   errorMode = 'Message',
  // }: {
  //   config: AxiosRequestConfig<TRequest>;
  //   restParams?: ExtractRouteParams<string>;
  //   errorMode?: 'Message' | 'Notification';
  // }): Promise<QueryResponse<TResponse>> {
  //   const userStore = useUserStore.getState();

  //   try {
  //     config.headers = {
  //       ...QueryUtil.getAuthHeaders(userStore),
  //       'Access-Control-Allow-Origin': '*',
  //     };

  //     if (config.data instanceof FormData) {
  //       config.headers['Content-Type'] = 'multipart/form-data';
  //     }

  //     if (restParams) {
  //       config.url = generatePath(config.url, restParams);
  //     }

  //     if (config.method === 'GET' && config.data) {
  //       config.params = config.data;
  //       delete config.data;
  //     }

  //     const client = apiClientFactory(config, restParams, errorMode);

  //     const res = await client.request<
  //       QueryResponse<TResponse>,
  //       AxiosResponse<QueryResponse<TResponse>>,
  //       TRequest
  //     >(config);

  //     /*
  //     if (res.data?.code === -1) {
  //       handleResponseError(res.data, { mode: errorMode } as any);
  //     }

  //     if (
  //       res.headers['content-type'] === 'multipart/form-data' &&
  //       res.headers['content-disposition']
  //     ) {
  //       const contentDisposition: string = res.headers['content-disposition'];
  //       res.data.fileName = decodeURIComponent(
  //         contentDisposition.slice(contentDisposition.indexOf('filename=') + 9),
  //       );
  //     }
  //       */

  //     return res.data;
  //   } catch (error: any) {
  //     if (error instanceof AxiosError && error.response?.status === 401) {
  //       userStore.logout();
  //       return null;
  //     }

  //     handleResponseError(
  //       { msg: error?.response?.data?.msg || error?.message },
  //       { mode: errorMode },
  //     );
  //     return null;
  //   }
  // }

  // static async paginate<TRequest extends object, TResponse>(
  //   url: string,
  //   req: PaginationRequest<TRequest>,
  //   signal?: AbortSignal,
  // ): Promise<PaginationResponse<TResponse>> {
  //   if (!req.pagination) {
  //     req.pagination = { current: 1, pageSize: 10 };
  //   }

  //   const res = await this.query<PaginationRequest<TRequest>, TResponse[]>({
  //     config: {
  //       url,
  //       method: 'POST',
  //       data: req,
  //       signal,
  //     },
  //   });

  //   return {
  //     pagination: res?.pagination,
  //     payload: res?.payload ?? [],
  //     sorter: res?.sorter,
  //   };
  // }
}

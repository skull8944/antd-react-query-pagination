import { useEffect, useRef } from 'react';
import type { Dispatch } from 'react';

import { useQuery as useReactQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

export type QueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'queryFn' | 'queryKey'
> & {
  callback?: Dispatch<TData>;
};

export type QueryFn<TData> = (signal?: AbortSignal) => Promise<TData>;

export const useQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData extends TQueryFnData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: TQueryKey;
  queryFn: QueryFn<TData>;
  options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
}) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  if (options && 'queryFn' in options) {
    delete options.queryFn;
  }

  const query = useReactQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryKey,
    queryFn: async () => {
      abortControllerRef.current = new AbortController();

      const d = await queryFn(abortControllerRef.current.signal);

      if (typeof options?.callback === 'function') {
        options.callback(d);
      }

      return d;
    },
  });

  useEffect(() => {
    return () => {
      abortControllerRef?.current?.abort();
    };
  });

  return { ...query, abortControllerRef };
};

export type UseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData extends TQueryFnData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = ReturnType<typeof useQuery<TQueryFnData, TError, TData, TQueryKey>>;

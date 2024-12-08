import type { Dispatch } from 'react';

import type { SorterResult } from 'antd/lib/table/interface';
import type { StoreApi } from 'zustand';

import type { Pagination, PaginationRequest } from '@/types/pagination';

export type PaginationStates<
  TRecord extends Record<string, unknown>,
  TSearchParams extends Record<string, unknown> = Record<string, unknown>,
> = {
  searchParams: TSearchParams;
  pagination: Pagination;
  sorters?: SorterResult<TRecord>[];
  req: PaginationRequest<TSearchParams>;
};

export type PaginationSetStateFns<
  TRecord extends Record<string, unknown>,
  TSearchParams extends Record<string, unknown> = Record<string, unknown>,
> = {
  setSearchParams: Dispatch<TSearchParams>;
  setPagination: Dispatch<Pagination>;
  setSorters: Dispatch<SorterResult<TRecord>[]>;
};

export type PaginationStore<
  TRecord extends Record<string, unknown>,
  TSearchParams extends Record<string, unknown> = Record<string, unknown>,
> = PaginationStates<TRecord, TSearchParams> &
  PaginationSetStateFns<TRecord, TSearchParams>;

type ZustandSetFn<T extends Record<string, unknown>> = StoreApi<T>['setState'];

export class PaginationUtil {
  static getInitState<
    TRecord extends Record<string, unknown>,
    TSearchParams extends Record<string, unknown> = Record<string, unknown>,
  >(searchParams: TSearchParams): PaginationStates<TRecord, TSearchParams> {
    return {
      searchParams,

      pagination: {
        current: 1,
        pageSize: 10,
      },

      req: {
        pagination: {
          current: 1,
          pageSize: 10,
        },

        query: searchParams,
      },
    };
  }

  static getSetStateFns<
    TRecord extends Record<string, unknown>,
    TSearchParams extends Record<string, unknown> = Record<string, unknown>,
    TSet extends ZustandSetFn<
      PaginationStates<TRecord, TSearchParams>
    > = ZustandSetFn<PaginationStates<TRecord, TSearchParams>>,
  >(set: TSet): PaginationSetStateFns<TRecord, TSearchParams> {
    return {
      setSearchParams: (searchParams) =>
        set(({ req, pagination }) => ({
          searchParams,

          req: {
            ...req,

            query: searchParams,

            pagination: {
              ...pagination,
              current: 1,
            },
          },
        })),

      setPagination: (pagination) =>
        set((prev) => {
          const newPagination = {
            ...pagination,

            current:
              pagination.pageSize !== prev.pagination?.pageSize
                ? 1
                : pagination.current,
          };

          return {
            pagination: newPagination,

            req: {
              ...prev.req,
              pagination: newPagination,
            },
          };
        }),

      setSorters: (sorters) =>
        set(({ pagination, req }) => {
          const newSorters = sorters.map((sorter) => ({
            field: sorter.field as string,
            order: sorter.order,
          }));

          const newPagination = {
            ...pagination,
            current: 1,
          };

          return {
            sorters: newSorters,

            pagination: newPagination,

            req: {
              ...req,
              pagination: newPagination,
              newSorter: newSorters,
            },
          };
        }),
    };
  }
}

import type { SorterResult } from 'antd/lib/table/interface';

import type { Pagination } from './Pagination';

export type PaginationRequest<
  TQuery extends Record<string, unknown> = Record<string, unknown>,
> = {
  pagination: Pagination;

  query: TQuery;

  sorters?: SorterResult[];
};

import type { SorterResult } from 'antd/lib/table/interface';

import type { Pagination } from './Pagination';

export type PaginationResponse<
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  pagination: Pagination;

  datas: TData[];

  sorters?: SorterResult[];
};

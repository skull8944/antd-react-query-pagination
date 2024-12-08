import type { TablePaginationConfig } from 'antd/lib/table';

export type Pagination = Required<
  Pick<TablePaginationConfig, 'current' | 'pageSize'>
> &
  Pick<TablePaginationConfig, 'total'>;

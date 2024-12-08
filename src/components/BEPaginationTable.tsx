import { Table } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';

import type { UseQuery } from '@/hooks/useQuery';
import type { PaginationStore } from '@/utils/pagination';

import type { PaginationResponse } from '@/types/pagination';

export type BEPaginationTableProps<
  TRecord extends Record<string, unknown> = Record<string, unknown>,
  TSearchParams extends Record<string, unknown> = Record<string, unknown>,
  TQueryFnData extends
    PaginationResponse<TRecord> = PaginationResponse<TRecord>,
  TUseQuery extends UseQuery = UseQuery<TQueryFnData>,
> = {
  query: TUseQuery;
  columns: Required<TableProps<TRecord>>['columns'];
  pagination?: TablePaginationConfig;
} & Omit<TableProps<TRecord>, 'pagination' | 'onChange'> &
  Pick<PaginationStore<TRecord, TSearchParams>, 'setPagination' | 'setSorters'>;

export const BEPaginationTable = <
  TRecord extends Record<string, unknown> = Record<string, unknown>,
  TSearchParams extends Record<string, unknown> = Record<string, unknown>,
>({
  query,
  pagination,
  loading,
  setPagination,
  setSorters,
  ...otherProps
}: BEPaginationTableProps<TRecord, TSearchParams>) => {
  const { total, current, pageSize } = query.data?.pagination ?? {};

  const showTotalLabel = () => (
    <span data-testid="pagination-label">
      {`${total} Items / page ${current} of ${Math.ceil(total ?? 0 / (pageSize ?? 1))}`}
    </span>
  );

  const onTableChange: TableProps<TRecord>['onChange'] = (
    _pagination,
    _,
    sorter,
  ) => {
    setPagination({
      current: _pagination.current ?? 1,
      pageSize: _pagination.pageSize ?? 10,
    });

    if (!Array.isArray(sorter) && !sorter?.column) {
      return;
    }

    if (Array.isArray(sorter)) {
      setSorters(sorter);
    } else {
      setSorters([sorter]);
    }
  };

  return (
    <Table
      loading={query.isLoading || loading}
      dataSource={query.data?.datas ?? []}
      {...otherProps}
      onChange={onTableChange}
      scroll={{ x: 500, y: 500 }}
      pagination={{
        ...query.data?.pagination,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: () => showTotalLabel(),
        ...pagination,
      }}
    />
  );
};

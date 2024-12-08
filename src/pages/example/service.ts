import type { ExampleRecord } from './_types';
import { PaginationQueryFn } from '@/types/pagination';

export const search: PaginationQueryFn<ExampleRecord> = async (req, signal) => {
  console.log(`query tool not implemented yet`, signal);

  const { pagination, sorters } = req;

  const total = 3000;

  pagination.total = total;

  const { current, pageSize } = pagination;
  const offset = (current - 1) * pageSize;

  const datas = Array.from<never, ExampleRecord>(
    { length: pageSize },
    (_, i) => ({
      id: i + offset,
      name: `name ${i + offset}`,
    }),
  );

  return {
    pagination,

    datas,

    sorters,
  };
};

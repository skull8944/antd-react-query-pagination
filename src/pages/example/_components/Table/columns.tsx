import type { ColumnsType } from 'antd/lib/table';
import type { ExampleRecord } from '../../_types';

export const columns: ColumnsType<ExampleRecord> = [
  {
    dataIndex: 'id',
    title: 'ID',
  },
  {
    dataIndex: 'name',
    title: 'Name',
  },
];

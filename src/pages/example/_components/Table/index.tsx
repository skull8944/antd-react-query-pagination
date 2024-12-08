import React from 'react';
import { useShallow } from 'zustand/shallow';

import { columns } from './columns';
import { useStore } from '../../store';
import { useSearchQuery } from '../../queryHook';

import { BEPaginationTable } from '@/components';

import type { ExampleRecord } from '../../_types';

export const Table: React.FC = () => {
  const { req, setPagination, setSorters } = useStore(
    useShallow((store) => ({
      req: store.req,
      setPagination: store.setPagination,
      setSorters: store.setSorters,
    })),
  );

  const searchQuery = useSearchQuery(req);

  return (
    <BEPaginationTable<ExampleRecord>
      columns={columns}
      query={searchQuery}
      setPagination={setPagination}
      setSorters={setSorters}
    />
  );
};

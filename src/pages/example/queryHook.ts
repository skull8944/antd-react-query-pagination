import * as service from './service';

import { useQuery } from '@/hooks';
import { QueryUtil } from '@/utils/query';

import type { PaginationQueryHook } from '@/types/pagination';
import type { ExampleRecord } from './_types';

export const QueryKeys = QueryUtil.getQueryKeys('Example', ['search']);

export const useSearchQuery: PaginationQueryHook<ExampleRecord> = (req) => {
  const [key] = QueryKeys.search;
  QueryKeys.search = [key, req];

  return useQuery({
    queryKey: QueryKeys.search,
    queryFn: (signal) => service.search(req, signal),
  });
};

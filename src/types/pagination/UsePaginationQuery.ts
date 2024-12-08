import type { UseQuery } from '@/hooks';
import type { PaginationRequest } from './PaginationRequest';
import type { PaginationResponse } from './PaginationResponse';

export type PaginationQueryHook<
  TRecord extends Record<string, unknown>,
  TSearchParams extends Record<string, unknown> = Record<string, unknown>,
> = (
  req: PaginationRequest<TSearchParams>,
) => UseQuery<PaginationResponse<TRecord>>;

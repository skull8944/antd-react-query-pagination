import type { PaginationRequest } from './PaginationRequest';
import type { PaginationResponse } from './PaginationResponse';

export type PaginationQueryFn<
  TRecord extends Record<string, unknown>,
  TSearchParams extends Record<string, unknown> = Record<string, unknown>,
> = (
  req: PaginationRequest<TSearchParams>,
  singal?: AbortSignal,
) => Promise<PaginationResponse<TRecord>>;

import { create } from 'zustand';

import { PaginationUtil } from '@/utils/pagination';
import type { PaginationStates, PaginationStore } from '@/utils/pagination';

import type { ExampleRecord } from './_types';

// shared states inside the page
type Store = PaginationStore<ExampleRecord>;

export const initState: PaginationStates<ExampleRecord> = {
  ...PaginationUtil.getInitState<ExampleRecord>({}),
};

export const useStore = create<Store>((set) => ({
  ...initState,

  ...PaginationUtil.getSetStateFns<ExampleRecord>(set),
}));

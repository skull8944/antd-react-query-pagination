export type QueryResponse<TData> =
  | {
      data: TData;
    }
  // when error
  | {
      message: string;
    };

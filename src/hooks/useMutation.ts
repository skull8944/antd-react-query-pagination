import { useCallback, useEffect, useRef } from 'react';
import type { Dispatch } from 'react';

import { useMutation as useReactMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';

export type MutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn' | 'mutationKey'
> & {
  callback?: Dispatch<TData>;
};

export const useMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>({
  mutationFn,
  options,
}: {
  mutationKey?: UseMutationOptions['mutationKey'];
  mutationFn: (variables: TVariables, signal?: AbortSignal) => Promise<TData>;
  options?: MutationOptions<TData, TError, TVariables, TContext>;
}) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  if (options && 'mutationFn' in options) {
    delete options.mutationFn;
  }

  const mutation = useReactMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: async (variables: TVariables) => {
      abortControllerRef.current = new AbortController();
      const d = await mutationFn(variables, abortControllerRef.current.signal);

      if (typeof options?.callback === 'function') {
        options.callback(d);
      }

      return d;
    },
  });

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    mutation.reset();
  }, [mutation]);

  useEffect(() => {
    return () => {
      reset();
    };
  });

  return { ...mutation, abortControllerRef, reset };
};

export type UseMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = ReturnType<typeof useMutation<TData, TError, TVariables, TContext>>;

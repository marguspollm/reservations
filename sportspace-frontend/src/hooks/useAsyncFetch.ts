import { useCallback, useState } from "react";
import { handleError } from "../utils/errors";

type AsyncFunction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

export function useAsyncFetch() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async <TArgs extends unknown[], TResult>(
      asyncFunction: AsyncFunction<TArgs, TResult>,
      ...args: TArgs
    ): Promise<TResult> => {
      try {
        setLoading(true);
        setError(null);
        return await asyncFunction(...args);
      } catch (error) {
        handleError(error, setError);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { execute, error, loading };
}

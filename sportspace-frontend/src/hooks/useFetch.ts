import { useEffect, useState } from "react";
import { handleError } from "../utils/errors";

export function useFetch<T>(fetcher?: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (!fetcher) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetcher();
        setData(res);
      } catch (error) {
        handleError(error, setError);
      } finally {
        setLoading(false);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, setData, setError, setLoading };
}

const BACKEND_URL = import.meta.env.VITE_API_HOST;

export async function apiFetch<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;

    const newError = new Error(
      errorBody?.message ?? "Request failed",
    ) as Error & { status?: number };

    newError.status = res.status;

    throw newError;
  }

  return res.json() as T;
}

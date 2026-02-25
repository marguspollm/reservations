import { apiFetch } from "./apiFetch";
import { triggerLogout } from "./fetchClient";

export async function authFetch<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const token = sessionStorage.getItem("token");

  const newHeaders = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    return await apiFetch<T>(endpoint, {
      ...options,
      headers: newHeaders,
    });
  } catch (error) {
    const err = error as Error & { status?: number };

    if (err.status === 403) {
      triggerLogout();
    }

    throw err;
  }
}

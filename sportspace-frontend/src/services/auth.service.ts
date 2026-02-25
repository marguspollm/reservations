import type { AuthToken } from "../models/AuthToken";
import type { Signup } from "../models/requests/Signup";
import type { User } from "../models/entities/User";
import { apiFetch } from "../api/apiFetch";

export const login = (email: string, password: string) => {
  return apiFetch<AuthToken>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
};

export const signup = (payload: Signup) => {
  return apiFetch<User>("/auth/signup", {
    method: "POST",
    body: payload,
  });
};

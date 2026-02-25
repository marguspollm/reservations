import type { User } from "../models/entities/User";
import { authFetch } from "../api/authFetch";

export const getAllUsers = () => {
  return authFetch<User[]>("/users");
};

export const getUser = (userId: number) => {
  return authFetch<User>(`/users/${userId}`);
};

export const updateUser = (userId: number, payload: User) => {
  return authFetch<User>(`/users/${userId}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteUser = (userId: string) => {
  return authFetch<User[]>(`/users/${userId}`, {
    method: "DELETE",
  });
};

export const changeRole = (userId: string) => {
  return authFetch<User>(`/change-role?userId=${userId}`, {
    method: "PATCH",
  });
};

export const getMe = () => {
  return authFetch<User>("/me");
};

export const updateMe = (payload: User) => {
  return authFetch<User>("/update-me", {
    method: "PUT",
    body: payload,
  });
};

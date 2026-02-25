import type { Role } from "../types/Role";

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  roles: Role[];
};

import { createContext } from "react";
import type { User } from "../models/entities/User";

type AuthContextType = {
  user: User | null;
  handleLogin: (token: string) => void;
  handleLogout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
  isLoggedIn: false,
  isLoading: true,
});

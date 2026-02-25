import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { User } from "../models/entities/User";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router";
import { getMe } from "../services/user.service";
import { registerLogout } from "../api/fetchClient";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  function handleLogin(token: string) {
    sessionStorage.setItem("token", token);
    navigate("/calendar");
  }

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    async function initAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await getMe();
        setUser(res);
      } catch {
        sessionStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, [token]);

  useEffect(() => {
    registerLogout(handleLogout);
  }, [handleLogout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        isLoggedIn,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

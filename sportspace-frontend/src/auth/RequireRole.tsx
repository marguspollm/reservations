import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router";
import Loading from "../components/Loading";
import type { Role } from "../models/types/Role";

type RequireRoleProps = {
  allowedRoles: Role[];
};

function RequireRole({ allowedRoles }: RequireRoleProps) {
  const { user, isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) return <Loading open={isLoading} />;

  if (!isLoggedIn) return <Navigate to="/" replace />;

  const hasRole = user?.roles.some(role => allowedRoles.includes(role));

  if (hasRole) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
}

export default RequireRole;
